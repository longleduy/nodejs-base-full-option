// Decorators
import {Controller} from "../utils/decorators/Controller.decorator";
import {Get} from "../utils/decorators/Get.decorator";
import {LogDecorator} from '../utils/decorators/RequestLogging.decorator';
import {Authenticate} from '../utils/decorators/Authentication.decorator';
// Utils

// Constans
import {prefixConstant, apiPath} from '../constants/index';
// Models
import JsonResponse from "../models/Response.model";
import {ISearchQuery} from '../models/ISearch.query';
import {userModel} from '../models/mongooese/User.model';

@Controller(prefixConstant.SEARCH)
export default class SearchController {
  @Get('')
  @Authenticate
  @LogDecorator
  public async search(req: ISearchQuery): Promise<JsonResponse> {
    const data = await userModel.findOne({userName:req.query.userName || ''});
    return new JsonResponse(data?[data]: null);
  }
}