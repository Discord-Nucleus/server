import type { RequestHandler } from "express";
import { Route } from "../structures";

export const middleware =
  (...handler: RequestHandler[]) =>
  (_target: Route, _propertyKey: string, descriptor: PropertyDescriptor) => {
    descriptor.value = [...handler, descriptor.value].flat(Infinity);
  };
