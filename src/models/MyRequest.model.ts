import { Request } from 'express';
import {ISession} from "./ISession.model";

interface MyRequest extends Request{
  reqId?: string
  session: ISession
}
export {
  MyRequest
}
