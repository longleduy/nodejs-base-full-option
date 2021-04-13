import {Request, Response} from 'express';
import SecureUtil from '../Secure.util';
import {UserRoleType} from "../../models/Types.model";
import {MyRequest} from "../../models/MyRequest.model";
import {ISession} from "../../models/ISession.model";
import {AuthenticationError} from "../errors/AuthenticationError.error";

interface Option{
  roles?: UserRoleType[]
}
export const Authenticate = (option?: Option) => (target: any, key: string, descriptor: any) => {
  const originalMethod = descriptor.value;
  descriptor.value = async function(...args: any[]) {
    const req: MyRequest = args[0];
    const res: Response = args[1];
    if(option?.roles && !option?.roles.includes(req.session.userRole)){
      throw new AuthenticationError();
    }
    await SecureUtil.verifyToken(req,res);
    return originalMethod.apply(this, args);
  };
  return descriptor;
};
