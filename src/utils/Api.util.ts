import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
// Decorators
import {LogPlayGetDecorator} from './decorators/RequestPlayLogging.decorator';
// Commons
import {logger} from "./_Logger.util";
// Config
import config from 'config';
//Errors
import RequestTimeOutError from './errors/RequestTimeOutError.error';
import Timeout = NodeJS.Timeout;

class ApiPlay {
  host: string = process.env.PLAY_HOST as string;
  hostV2: string = process.env.PLAY_HOST_V2 || '';
  retries: number = config.get("apiConfig.retryCallPlay");

  @LogPlayGetDecorator
  public async get(endPoint: string, query: object, par?: string): Promise<object> {
    let params: object = {params: {...query}};
    try {
      return await axios.get(this.host + endPoint + (par ? '/' + par : ''), {timeout: 3000, params});
    } catch (e) {
      throw Error(e);
    }

  }

  @LogPlayGetDecorator
  public async getV2(endPoint: string, query: object, par?: string, reqId?: string): Promise<object> {
    try {
      return await new Promise(async (resolve, reject) => {
        try {
          const source = axios.CancelToken.source();
          const id: Timeout = setTimeout(
            () => {
              source.cancel(`SSR/SPA ${reqId} cancle by time out error`);
              reject(new RequestTimeOutError());
            },
            Number(process.env.PLAY_REQUEST_TIMEOUT)
          );
          let start = Date.now();
          const data = await axios.get(this.hostV2 + endPoint + (par ? '/' + par : ''), {
            cancelToken: source.token,
            params: {...query}
          });
          clearTimeout(id);
          //FIXME: Remove
          logger.info(`PROCESS ${reqId} PlayApi ${endPoint} response time: ${(Date.now() - start).toString()}ms`);
          resolve(data);
        } catch (e) {
          logger.error(e);
          reject(e);
        }
      });

    } catch (e) {
      throw e;
    }

  }

  @LogPlayGetDecorator
  public async getV3(endPoint: string, query: object, par?: string, reqId?: string): Promise<object> {
    let params: object = {params: {...query}};
    try {
      return await axios.get(this.hostV2 + endPoint + (par ? '/' + par : ''), params);
    } catch (e) {
      throw Error(e);
    }

  }

  @LogPlayGetDecorator
  public async getWithRetry(endPoint: string, query: object, retries: number = this.retries): Promise<any> {
    let params: object = {params: {...query}};
    try {
      const result = await axios.get(this.host + endPoint, params);
      if (result.status === 200) return result;
      if (retries > 0) {
        return this.getWithRetry(endPoint, query, retries - 1)
      } else {
        return {status: 500, data: {}, message: null}
      }
    } catch (e) {
      if (retries > 0) {
        return this.getWithRetry(endPoint, query, retries - 1)
      } else {
        throw Error(e);
      }
    }
  }

};
export default new ApiPlay();