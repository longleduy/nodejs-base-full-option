import {Request} from "express";

export interface ISignInBody extends Request {
  body: {
    userName: string,
    passWord: string
  }
};