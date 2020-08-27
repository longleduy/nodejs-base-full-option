//Utils
import {Post} from '../utils/decorators/Post.decorator'
import {LogDecorator} from "../utils/decorators/RequestLogging.decorator";
import {Controller} from "../utils/decorators/Controller.decorator";
import SecureUtil from '../utils/Secure.util';
//Models
import {userModel} from "../models/mongooese/User.model";
import {ISignInBody} from "../models/ISignIn.body";
import JsonResponse from "../models/Response.model";
import Payload from '../models/Payload.model';
import {ISession} from '../models/ISession.base';
import SignIn from '../models/SignIn.model';
//Constants
import {prefixConstant,apiPath} from "../constants";

@Controller(prefixConstant.INDEX)
export  default class UserController {
  @Post(apiPath.SIGN_IN)
  @LogDecorator
  public async signIn(req: ISignInBody): Promise<JsonResponse> {
    const signInInfo: {userName: string, passWord: string} = {...req.body};
    const data: any = await userModel.findOne(signInInfo);
    const signInData: SignIn = new SignIn('');
    if(data){
      const payload: Payload = new Payload(data.userName,data.profileName);
      const token: string = SecureUtil.generateToken(payload);
      payload.token = token;
      const sess = req.session as ISession;
      sess.userName = data.userName;
      sess.profileName = data.profileName;
      sess.token = token;
      signInData.token = token;
    }
    return new JsonResponse(signInData);
  }
}