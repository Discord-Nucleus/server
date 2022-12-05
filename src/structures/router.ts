import { NextFunction, Request, Response, Router } from "express";

export abstract class Route {
  public readonly router: Router = Router({ mergeParams: true });

  constructor() {
    this.router.all("/", this.all);
    this.router.get("/", this.get);
    this.router.post("/", this.post);
    this.router.put("/", this.put);
    this.router.delete("/", this.delete);
    this.router.patch("/", this.patch);
    this.router.options("/", this.options);
    this.router.head("/", this.head);
  }

  protected all(request: Request, response: Response, next: NextFunction): void {
    next();
  }
  protected get(request: Request, response: Response, next: NextFunction): void {
    next();
  }
  protected post(request: Request, response: Response, next: NextFunction): void {
    next();
  }
  protected put(request: Request, response: Response, next: NextFunction): void {
    next();
  }
  protected delete(request: Request, response: Response, next: NextFunction): void {
    next();
  }
  protected patch(request: Request, response: Response, next: NextFunction): void {
    next();
  }
  protected options(request: Request, response: Response, next: NextFunction): void {
    next();
  }
  protected head(request: Request, response: Response, next: NextFunction): void {
    next();
  }
}
