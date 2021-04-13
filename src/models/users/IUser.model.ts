import {MyRequest} from "../MyRequest.model";
import {UserModel} from "../mongooese/User.model";


interface ILoginBody extends MyRequest{
    body: {
        userName: string
        passWord: string
    }
}
interface ILoginServiceParam {
    userName: string
    passWord: string
}
interface IRegisterBody extends MyRequest{
    body: {
        userName: string
        passWord: string
    }
}
export {
    ILoginBody,
    ILoginServiceParam,
    IRegisterBody
}