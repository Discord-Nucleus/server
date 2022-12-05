import { json } from "body-parser";
import EventEmitter from "events";
import express, { Application, NextFunction, Request, Response } from "express";
import Http from "http";
import { relative } from "path";
import TypedEmitter from "typed-emitter";
import { RegExp } from "../constants";
import { bson } from "../middlewares";
import type { ServerEvents, ServerOptions } from "../types";
import { walk } from "../utilities";
import type { Route } from "./router";

export class Server extends (EventEmitter as new () => TypedEmitter<ServerEvents>) {
  public application: Application = express();
  public http: Http.Server = Http.createServer(this.application);

  constructor(
    /* prettier-ignore */
    public options: ServerOptions = {}
  ) {
    super();

    options.port ??= 8080;
    options.host ??= "127.0.0.1";
    options.hidePoweredBy ??= true;

    if (this.options.hidePoweredBy) this.application.disable("x-powered-by");

    this.initialize();
  }

  public start(): void {
    if (!this.http.listening) {
      const { host, port } = this.options;
      this.http.listen(port, host, () => this.emit("ready"));
    }
  }

  public close(): void {
    this.http.close(() => this.emit("close"));
  }

  public registerRoutes(root: string): void {
    const matches = walk(root, RegExp.NodeModule).sort((a, b) => (RegExp.Bracket.test(a) ? 1 : -1));

    for (const file of matches) {
      const path =
        "/" +
        relative(root, file)
          .replaceAll("\\", "/")
          .replaceAll(RegExp.Bracket, (_substring, match) => `:${match}`)
          .replace(RegExp.RouteExtra, "");

      const routeModule: { new (): Route } = require(file).default;
      const { router } = new routeModule();

      this.application.use(path, router);
    }
  }

  protected initialize(): void {
    this.application.use((request: Request, response: Response, next: NextFunction) => {
      request.server = this;
      next();
    });

    this.application.use(bson());
    this.application.use(json());
  }

  protected errorHandler(error: Error, request: Request, response: Response, next: NextFunction): void {
    response.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
}
