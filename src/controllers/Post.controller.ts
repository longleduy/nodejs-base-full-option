import {Controller} from "../utils/decorators/Controller.decorator";
import {Post} from "../utils/decorators/Post.decorator";
import {WriteClientRequestLog} from "../utils/decorators/ClientRequestLogWriter.decorator";
import {Authenticate} from "../utils/decorators/Authentication.decorator";
//Utils
import {apiPath, prefixConstant} from "../constants";
import PostService from '../services/Post.service';
//Models
import {IPostAddBody} from "../models/posts/IPost.model";
import JsonResponse from "../models/Response.model";
import {PostInfo} from "../models/posts/Post.model";

@Controller(prefixConstant.POST)
class PostController{
    @Post(apiPath.ADD_POST)
    @WriteClientRequestLog
    @Authenticate()
    public async addPost(req: IPostAddBody): Promise<JsonResponse<PostInfo>>{
        await PostService.addPost(req,{
            content: req.body.content,
            status: 'PUBLIC'
        });
        return new JsonResponse<PostInfo>({message: 'SUCCESS'});
    }
}
export default PostController;