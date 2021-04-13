import {PostStatusType} from "../Types.model";

class PostInfo{
    postId: string
    userId: string
    content: string
    status: PostStatusType
    createAt: number
    updateAt: number
};
export {
    PostInfo
}