import Redis from 'ioredis';
import * as PromiseBlubird from "bluebird";
import redisConnect from 'connect-redis';
import session from 'express-session';
import Timeout = NodeJS.Timeout;
import express from 'express';
//Utils
import LoggerUtil from "./Logger.util";
//Constants
import {msgConstant} from "../constants";
//Errors
import RequestTimeOutError from './errors/RequestTimeOutError.error';
import dotenv from 'dotenv';

dotenv.config();

interface RedisRequestOption {
  throwError?: boolean,
  defaultResponse?: any
}
class RedisUtil {
  clientSync!: Redis.Redis | Redis.Cluster;
  client: any;
  RedisStore: redisConnect.RedisStore;
  redisSession: express.RequestHandler;
  constructor() {
    this.connect();
    // @ts-ignore
    this.client = PromiseBlubird.promisifyAll(this.clientSync);
    this.RedisStore = redisConnect(session);
    this.redisSession = session({
      secret: process.env.REDIS_SECRET_SESSION_KEY as string,
      resave: false,
      saveUninitialized: false,
      // @ts-ignore
      store: new this.RedisStore({client: this.clientSync }),
      cookie: {}
    });
    LoggerUtil.logger.info("Redis Session create!");
  }

  public connect() {
    if(process.env.REDIS_CLUSTER as string === "1"){
      const listRedisNode: any[] = JSON.parse(process.env.REDIS_CLUSTER_NODE as string);
      LoggerUtil.logger.info(listRedisNode);
      this.clientSync = new Redis.Cluster(listRedisNode);
    }
    else{
      this.clientSync = new Redis({
        port: parseInt(process.env.REDISDB_PORT as string),
        host: process.env.REDISDB_HOST,
        password: process.env.REDIS_PASSWORD
      });
    }
    LoggerUtil.logger.info(msgConstant.REDIS_CONNECTING);
    this.clientSync.on('connect', function () {
      LoggerUtil.logger.info(msgConstant.REDIS_CONNECTED);
    });
    let reconect = 0;
    this.clientSync.on("error", function (err:any) {
      reconect = reconect +1;
      LoggerUtil.logger.info(reconect);
      LoggerUtil.logger.error(err.stack);
    });
  }
  public async redisRequest(...arg: any[]) {
    const redisAction: string = arguments[0];
    const option: RedisRequestOption = arguments[1] || {};
    try {
      const paramsArr: any = {...arguments};
      delete paramsArr[0];
      delete paramsArr[1];
      const params = Object.values(paramsArr);
      let id: Timeout;
      return await new Promise(async (resolve, reject) => {
        try {
          id = setTimeout(
            () => {
              LoggerUtil.logger.error(`Redis request ${redisAction} ${params.join()} time out!`);
              reject(new RequestTimeOutError());
            },
            Number(1)
          );
          const data = await this.client[redisAction](...params);
          clearTimeout(id);
          resolve(data);
        } catch (e) {
          clearTimeout(id);
          reject(e);
        }
      })
    }
    catch(e) {
      if (option.throwError === false) {
        LoggerUtil.logger.error(e.stack || e);
        return option.defaultResponse
      }
      throw e;
    }
  }
}
export default new RedisUtil();