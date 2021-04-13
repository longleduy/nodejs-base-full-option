import FirebaseService from '../services/FireBase.service';
//Models
import {IPostAddService} from "../models/posts/IPost.model";
import {MyRequest} from "../models/MyRequest.model";

class PostService{
    ref = 'posts';
    public async addPost(req: MyRequest ,data: IPostAddService): Promise<void>{
        await FirebaseService.pushData(
            req,
            this.ref,
            req.session.userId,
            data);
    }
};
export default new PostService();