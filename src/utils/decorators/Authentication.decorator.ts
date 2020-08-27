import AuthenticationError from "../errors/AuthenticationError.error";
import SecureUtil from '../Secure.util';
export const Authenticate = (target: any, key: string, descriptor: any) => {
  const originalMethod = descriptor.value;
  descriptor.value = async function(...args: any[]) {
    const req: Express.Request = args[0];
    const isAuth: boolean = await SecureUtil.verifyToken(req);
    if(!isAuth){
      throw new AuthenticationError();
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
};
