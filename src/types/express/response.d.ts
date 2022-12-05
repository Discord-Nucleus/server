import type { Document } from "bson";

export declare global {
  namespace Express {
    export interface Response {
      bson: (body: Document) => this;
    }
  }
}
