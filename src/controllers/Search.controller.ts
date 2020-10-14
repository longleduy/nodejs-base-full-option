import {Response} from 'express';
// Decorators
import {Controller} from "../utils/decorators/Controller.decorator";
import {Get} from "../utils/decorators/Get.decorator";
import {LogDecorator} from '../utils/decorators/RequestLogging.decorator';
import {Authenticate} from '../utils/decorators/Authentication.decorator';
// Utils
import PostgresUtil from '../utils/Postgres.util';
// Constans
import {prefixConstant, apiPath} from '../constants/index';
// Models
import JsonResponse from "../models/Response.model";
import {ISearchQuery} from '../models/ISearch.query';
import {UserModel} from '../models/mongooese/User.model';

@Controller(prefixConstant.SEARCH)
export default class SearchController {
  @Get('')
  @Authenticate
  @LogDecorator
  public async search(req: ISearchQuery,res:Response): Promise<JsonResponse> {
    const data = await UserModel.findOne({userName:req.query.userName || ''});
    return new JsonResponse(data?[data]: null);
  }
  @Get('/postgres')
  @LogDecorator
  public async searchPostgres(req: ISearchQuery): Promise<JsonResponse> {
    const data = await PostgresUtil.pool.query('SELECT * FROM USERS');
    return new JsonResponse(data?[data.rows]: null);
  }
}