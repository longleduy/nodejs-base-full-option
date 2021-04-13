import {FilterQuery} from "mongoose";
//Utils
import {AuthenticationError} from "../utils/errors/AuthenticationError.error";
import {msgConstant} from "../constants";
import SercureUtil from '../utils/Secure.util';
//Models
import {User, UserModel} from "../models/mongooese/User.model";
import {ILoginServiceParam, IRegisterBody} from "../models/users/IUser.model";
import {LoginInfo} from "../models/users/LoginInfo.model";
import {MyRequest} from "../models/MyRequest.model";
import {ISession} from "../models/ISession.model";
import {IPayload} from "../models/IPayload.model";
import {OtherError} from "../utils/errors/OtherError.error";


class UserService{
    public async getUserInfo(query: FilterQuery<User>): Promise<User | null>{
        const data = await UserModel.findOne(query);
        return data;
    }
    public async getUserInfoById(req: MyRequest, id: string): Promise<User>{
        const data = await UserModel.findById(id).select('-__v -passWord');
        if(!data) throw new OtherError({
            message: msgConstant.ERROR_DATA_NOT_FOUND,
            status: 404
        })
        return data;
    }
    public async login(req: MyRequest, params: ILoginServiceParam): Promise<LoginInfo> {
        const data = await this.getUserInfo({
            userName: params.userName
        });
        if (!data) throw new AuthenticationError({message: msgConstant.ERROR_AUTHENTICATE});
        const isMatchPassword = await SercureUtil.comparePassWord(params.passWord, data.passWord);
        if (!isMatchPassword) throw new AuthenticationError({message: msgConstant.ERROR_AUTHENTICATE});
        const payload: IPayload = {
            // @ts-ignore
            userId: data._id.toHexString(),
            userName: data.userName,
            userRole: data.role || 'MEMBER'
        }
        const jwt = SercureUtil.generateToken(payload);
        // @ts-ignore
        req.session.userId = payload.userId;
        req.session.userName = payload.userName;
        req.session.userRole = payload.userRole;
        req.session.token = jwt;
        const loginInfo = new LoginInfo();
        loginInfo.jwt = jwt;
        return loginInfo
    }
    public async register(req: IRegisterBody): Promise<void> {
        const hashPassword = await SercureUtil.hashPassWord(req.body.passWord);
        await UserModel.create({
            userName: req.body.userName,
            passWord: hashPassword
        });
    }
}
export default new UserService();