import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//Models
import Payload from "../models/Payload.model";
import {ISession} from "../models/ISession.base";

dotenv.config();
class SecureUtil {
  public generateToken(payload: Payload): string{
    const payloadObj: object = {...payload};
    return jwt.sign(payloadObj,process.env.JWT_SECRET_KEY as string,{expiresIn: process.env.JWT_EXPIRE_TIME});
  }
  public async hashPassWordAsync(password: string): Promise<string>{
    return  await bcrypt.hash(password, process.env.BCRYPT_SALT_NUMBER || 10);
  }
  public async comparePassWordAsync(passWord: string, passWordHashed: string): Promise<boolean>{
    return await bcrypt.compare(passWord, passWordHashed);
  }
  public async verifyToken(req: Express.Request): Promise<boolean>{
    const sess = req.session as ISession;
    // @ts-ignore
    const token: string = req.headers.authorization || '';
    try {
      const payload: any = await jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      return payload.userName === sess.userName
    }
    catch (e) {
      return false;
    }
  }
}
export default new SecureUtil();