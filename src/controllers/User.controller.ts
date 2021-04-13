//Utils
import {Post} from '../utils/decorators/Post.decorator'
import {WriteClientRequestLog} from "../utils/decorators/ClientRequestLogWriter.decorator";
import {Controller} from "../utils/decorators/Controller.decorator";
import {Get} from "../utils/decorators/Get.decorator";
import {Authenticate} from "../utils/decorators/Authentication.decorator";
//Services
import UserService from '../services/User.service';
import logger from '../utils/Logger.util';
//Models
import {User, UserModel} from "../models/mongooese/User.model";
//Constants
import {prefixConstant, apiPath} from "../constants";
import {ILoginBody, IRegisterBody} from "../models/users/IUser.model";
import JsonResponse from "../models/Response.model";
import {LoginInfo} from "../models/users/LoginInfo.model";
import {MyRequest} from "../models/MyRequest.model";
import {ISession} from "../models/ISession.model";
import {OtherError} from "../utils/errors/OtherError.error";

@Controller(prefixConstant.USER)
export default class UserController {
    @Post(apiPath.SIGN_IN)
    @WriteClientRequestLog
    public async login(req: ILoginBody): Promise<JsonResponse<LoginInfo>> {
        const data = await UserService.login(req,{
            userName: req.body.userName,
            passWord: req.body.passWord
        })
        return new JsonResponse<LoginInfo>({data});
    }
    @Post(apiPath.REGISTER_USER)
    @WriteClientRequestLog
    public async register(req: IRegisterBody): Promise<JsonResponse<any>> {
        await UserService.register(req);
        return new JsonResponse<User>({message: 'SUCCESS'});
    }

    @Get(apiPath.USER_INFO)
    @WriteClientRequestLog
    @Authenticate({roles: ['MEMBER']})
    public async getUserInfo(req: MyRequest): Promise<JsonResponse<User>>{
        const sess = req.session as ISession;
        const data = await UserService.getUserInfoById(req, sess.userId || '');
        return new JsonResponse<User>({data})
    }

}