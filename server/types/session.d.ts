import { SessionData } from "express-session";
declare module "express-session" {
  export interface SessionData {
    userData?: any;
    newTokenRequired?: boolean;
  }
}


// export {}