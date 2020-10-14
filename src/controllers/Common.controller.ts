// Decorators
import {Controller} from "../utils/decorators/Controller.decorator";
import {Get} from "../utils/decorators/Get.decorator";
import {LogDecorator} from '../utils/decorators/RequestLogging.decorator';
// Utils
import RedisUtil from '../utils/Redis2.util';
// Constans
import {prefixConstant, apiPath} from '../constants/index';
// Models
import JsonResponse from "../models/Response.model";
import {Post} from "../utils/decorators/Post.decorator";
import {copyMeetingData, IMeetingBody, IMeetingData} from "../models/IMeeting.model";

@Controller(prefixConstant.INDEX)
export default class CommonController {
  @Get(apiPath.REDIS_PING)
  @LogDecorator
  public async pingRedis(): Promise<JsonResponse> {
    const data = await RedisUtil.client.ping();
    return new JsonResponse([{status: data}]);
  }
  @Get(apiPath.REDIS_PING_TIMEOUT)
  @LogDecorator
  public async pingRedisTimeOut(): Promise<JsonResponse> {
    const data = await RedisUtil.redisRequest('ping');
    return new JsonResponse([{status: data}]);
  }
  @Post('/meeting')
  @LogDecorator
  public async updateMeeting(req: IMeetingBody): Promise<JsonResponse> {
    const updateData: IMeetingData = {...req.body};
    const updateData2: IMeetingData = copyMeetingData({...req.body});
    console.log("updateData", updateData);
    console.log("updateData2", updateData2);
    return new JsonResponse([{status: {}}]);
  }
}