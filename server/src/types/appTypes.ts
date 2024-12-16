import { User } from "../../../shared/types/gameTypes";
import { Request } from "express";
export interface CustomRequest extends Request {
  user?: User;
}
