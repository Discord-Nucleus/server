import { Regex, walk } from "@discord-nucleus/utilities";
import { json } from "body-parser";
import EventEmitter from "events";
import express, { Application, NextFunction, Request, Response } from "express";
import Http from "http";
import { relative } from "path";
import TypedEmitter from "typed-emitter";
import { bson } from "../middlewares";
import type { ServerEvents, ServerOptions } from "../types";
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
    const matches = walk(root, Regex.Global.Importable).sort((a, b) => (Regex.Route.Params.test(a) ? 1 : -1));

    for (const file of matches) {
      const path =
        "/" +
        relative(root, file)
          .replaceAll("\\", "/")
          .replaceAll(Regex.Route.Params, (_substring, match) => `:${match}`)
          .replace(Regex.Route.Extra, "");

      const routeModule: { new (): Route } = require(file).default;
      const { router } = new routeModule();

      this.application.use(path, router);
    }
    this.application.use(this.errorHandler);
    this.application.use("*", this.errorHandler);
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

  protected notFoundHandler(request: Request, response: Response, next: NextFunction): void {
    response.status(404).json({
      code: 404,
      message: "Not Found",
    });
  }
}
