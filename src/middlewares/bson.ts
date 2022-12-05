import * as BSON from "bson";
import type { NextFunction, Request, Response } from "express";
import getRawBody from "raw-body";
import typeis, { hasBody } from "type-is";
import type { OptionsBson } from "../types";

export const bson = (options: OptionsBson = {}) => {
  options.type ??= "application/bson";
  options.limit ??= "100kb";

  return (request: Request, response: Response, next: NextFunction) => {
    response.bson = (data: BSON.Document) => {
      const serialized = BSON.serialize(data);
      return response.header("Content-Type", options.type!).send(serialized);
    };

    if (typeis(request, options.type!) && hasBody(request))
      getRawBody(request, { limit: options.limit, length: request.headers["content-length"] })
        .then((rawBody: Buffer) => {
          request.body = BSON.deserialize(rawBody);
          next();
        })
        .catch(next);
    else next();
  };
};
