import grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
// Config
import config from 'config';
// Constant
import {msgConstant} from '../constants/index';
// Commons
import LoggerUtil from "./Logger.util";
import ServiceError from '../utils/errors/ServiceError.error';
// Decorators
import {LogPyServiceDecorator} from './decorators/RequestPyServiceLogging.decorator';
import RequestTimeOutError from "./errors/RequestTimeOutError.error";
import Timeout = NodeJS.Timeout;

interface PyRequestOption {
  throwError?: boolean,
  defaultResponse?: any
}
class PyService{
  client: any;
  PROTO_PATH = __dirname + config.get("pathConfig.protoFilePath");
  defaultRespone  = config.get("pyConfig.defaultRespone");
  constructor() {
    this.initGrpcClient();
  }
  public initGrpcClient(){
    let packageDefinition = protoLoader.loadSync(
      this.PROTO_PATH,
      {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      });
    let episode_proto: any = grpc.loadPackageDefinition(packageDefinition).episode;
    LoggerUtil.logger.info(msgConstant.GRPC_CREATED);
    this.client = new episode_proto.Episode(process.env.PY_PROTO_HOST,grpc.credentials.createInsecure());
  }
  @LogPyServiceDecorator
  public callService(functionName: string, reqParams: any,option?:PyRequestOption): any{
    return new Promise((resolve, reject) => {
      const id: Timeout = setTimeout(
        () => {
          reject(new RequestTimeOutError());
        },
        Number(process.env.PY_REQUEST_TIMEOUT)
      );
      this.client[functionName](reqParams, (error: any, response: any) => {
        clearTimeout(id);
        if (error) {
          LoggerUtil.logger.error(msgConstant.PY_SERVICE_ERROR,error);
          resolve(null);
        } else {
          if (response.respone_code != 1) {
            LoggerUtil.logger.error(msgConstant.PY_SERVICE_ERROR);
            resolve(null);
          }
          resolve(response);
        }
      });
    });
  }
  @LogPyServiceDecorator
  public callServiceDefaultRespone(functionName: string, reqParams: any,option?:PyRequestOption): any{
    return new Promise((resolve, reject) => {
      const id: Timeout = setTimeout(
        () => {
          LoggerUtil.logger.error(`Py request ${functionName} ${JSON.stringify(reqParams)} time out!`);
          reject(new RequestTimeOutError());
        },
        Number(1000)
      );
      this.client[functionName](reqParams, (error: any, response: any) => {
        clearTimeout(id);
        if (error) {
          reject(new ServiceError(error.stack));
        } else {
          if (response.respone_code != 1) {
            reject(new ServiceError(response.respone_msg));
          }
          resolve(response);
        }
      });
    });
  }
}
export default new PyService();