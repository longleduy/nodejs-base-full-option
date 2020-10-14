import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {Request, Response} from 'express';
//Models
import Payload from "../models/Payload.model";
import {ISession} from "../models/ISession.base";
//Utils
import LoggerUtil from './Logger.util';
import AuthenticationError from "./errors/AuthenticationError.error";

dotenv.config();
class SecureUtil {
  public generateToken = (payload: Payload): string => {
    const payloadObj: object = {...payload};
    return jwt.sign(payloadObj,process.env.JWT_SECRET_KEY as string,{expiresIn: process.env.JWT_EXPIRE_TIME});
  }
  public async hashPassWordAsync(password: string): Promise<string>{
    return  await bcrypt.hash(password, process.env.BCRYPT_SALT_NUMBER || 10);
  }
  public async comparePassWordAsync(passWord: string, passWordHashed: string): Promise<boolean>{
    return await bcrypt.compare(passWord, passWordHashed);
  }
  public async verifyToken(req: Request, res: Response): Promise<void>{
    const sess = req.session as ISession;
    // @ts-ignore
    const token: string = req.headers.authorization || '';
    try {
      const payload: any = await jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      const isAuth: boolean = payload.userName === sess.userName && token === sess.token;
      if(!isAuth){
        throw Error();
      }
    }
    catch (e) {
      if(e.name === 'TokenExpiredError'){
        console.log("TokenExpiredError");
        const info: any = await jwt.decode(token);
        const expTime: number = Date.now() - info.exp*1000;
        if(expTime < 60000 && info.userName === sess.userName && token === sess.token){
          console.log("Token refresh");
          const payload: any = {
            userName: info.userName,
            profileName: info.profileName
          };
          const newToken: string = await this.generateToken(payload);
          sess.token = newToken;
          res.set('Access-Control-Expose-Headers','x-refresh-token');
          res.set('x-refresh-token', newToken)
        }
        else{
          throw new AuthenticationError(e);
        }
      }
      else{
        throw new AuthenticationError(e);
      }
    }
  }
}
export default new SecureUtil();