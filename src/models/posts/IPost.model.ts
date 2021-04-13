import {MyRequest} from "../MyRequest.model";
import {PostStatusType} from "../Types.model";

interface IPostAddBody extends MyRequest{
    body: {
        content: string
    }
};
interface IPostAddService{
    content: string
    status: PostStatusType
}
export {
    IPostAddBody,
    IPostAddService
}