import express, {Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
// Controllers
import CommonController from './controllers/Common.controller';
import SearchController from './controllers/Search.controller';
import UserController from './controllers/User.controller';
// Utils
import {IRouteDefinition} from './utils/definitions/Route.definition';
import LoggerUtil from './utils/Logger.util';
import OtherUtil from './utils/Other.util';
import MongoUtil from './utils/Mongo.util';
import RedisUtil from './utils/Redis2.util';
// Models
import JsonRespone from './models/Response.model';
// Constants
import {msgConstant} from './constants/index';

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.initRoutes();
    MongoUtil.connect();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.NODE_ENV !== 'production' ? "*" : process.env.CLIENT_ORIGIN_PROD,
      allowedHeaders:['X-Requested-With','X-HTTP-Method-Override','Content-Type','Accept','Authorization'],
      credentials:process.env.NODE_ENV === 'production',
      methods:['POST','GET']
    }));
    this.app.use(RedisUtil.redisSession);
  }

  private initRoutes(): void {
    const listController: any = [
      CommonController,
      SearchController,
      UserController
    ];
    listController.forEach((controller: any) => {
      const instance = new controller();
      const prefix = Reflect.getMetadata('prefix', controller);
      const routes: IRouteDefinition[] = Reflect.getMetadata('routes', controller);
      routes.forEach((route) => {
        this.app[route.requestMethod](prefix + route.path, async (req: Request, res: Response) => {
          let reqId = OtherUtil.genAutoID();
          try {
            let start: number = Date.now();
            // @ts-ignore
            req.reqId = reqId;
            const data: JsonRespone = await instance[route.methodName](req, res);
            LoggerUtil.logger.info(msgConstant.getMsg('PROCESS_TOTAL_TIME',reqId,(Date.now() - start).toString()));
            res.status(data.getStatusCode());
            res.json(data.getData());
          } catch (e) {
            const message: string = e.role === 1 ? e.message : msgConstant.ERROR_MSG;
            const status: number = e.role === 1 ? e.status : 500;
            const data: JsonRespone = new JsonRespone([],status, message);
            res.status(status);
            res.json(data.getData());
            LoggerUtil.logger.error(`Request ${reqId} has error: 
${e.stack}`);
          }
        });
      });
    });
  }
}

export default new App().app;