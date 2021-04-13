import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {Request, Response} from 'express';
//Models
import {ISession} from "../models/ISession.model";
//Utils
import LoggerUtil from './Logger.util';
import {AuthenticationError} from "./errors/AuthenticationError.error";
import {IPayload} from "../models/IPayload.model";
import {MyRequest} from "../models/MyRequest.model";
import {plainToClass} from "class-transformer";

dotenv.config();
class SecureUtil {
  public generateToken(payload: IPayload): string{
    const payloadObj: object = {...payload};
    return jwt.sign(payloadObj,process.env.JWT_SECRET_KEY as string,{expiresIn: Number(process.env.JWT_EXPIRE_TIME)});
  }
  public async hashPassWord(password: string): Promise<string>{
    return  await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_NUMBER || 10));
  }
  public async comparePassWord(passWord: string, passWordHashed: string): Promise<boolean>{
    return await bcrypt.compare(passWord, passWordHashed);
  }
  public async verifyToken(req: MyRequest, res: Response): Promise<void>{
    const sess = req.session;
    const token: string = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '';
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
            userId: info.userId,
            userName: info.userName,
            userRole: info.role
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