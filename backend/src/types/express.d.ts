import { IUser } from "../utils/interfaces/user.interface";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}
