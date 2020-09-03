import {Request, Response} from 'express';
import SecureUtil from '../Secure.util';
export const Authenticate = (target: any, key: string, descriptor: any) => {
  const originalMethod = descriptor.value;
  descriptor.value = async function(...args: any[]) {
    const req: Request = args[0];
    const res: Response = args[1];
    await SecureUtil.verifyToken(req,res);
    return originalMethod.apply(this, args);
  };
  return descriptor;
};
