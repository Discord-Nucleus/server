import type { Server } from "../../structures";

export declare global {
  namespace Express {
    export interface Request {
      server: Server;
    }
  }
}
