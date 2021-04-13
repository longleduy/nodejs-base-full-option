import express, {Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
// Controllers
import UserController from './controllers/User.controller';
import PostController from './controllers/Post.controller';
// Utils
import {IRouteDefinition} from './utils/definitions/Route.definition';
import logger from './utils/Logger.util';
import OtherUtil from './utils/Other.util';
import MongoUtil from './utils/Mongo.util';
import RedisUtil from './utils/Redis2.util';
import Firebaseutil from './utils/FireBase.util';
// Models
import JsonRespone from './models/Response.model';
// Constants
import {msgConstant} from './constants/index';
import {MyRequest} from "./models/MyRequest.model";

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    Firebaseutil.init();
    MongoUtil.connect();
    this.config();
    this.initRoutes();
    //PostgresUtil.connect();
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
      UserController,
      PostController
    ];
    listController.forEach((controller: any) => {
      const instance = new controller();
      const prefix = Reflect.getMetadata('prefix', controller);
      const routes: IRouteDefinition[] = Reflect.getMetadata('routes', controller);
      routes.forEach((route) => {
        this.app[route.requestMethod](prefix + route.path, async (mainRequest: Request, res: Response) => {
          let reqId = OtherUtil.genAutoID();
          const req = mainRequest as MyRequest;
          try {
            let start: number = Date.now();
            req.reqId = reqId;
            const data: JsonRespone<any> = await instance[route.methodName](req, res);
            logger.info(msgConstant.getMsg('PROCESS_TOTAL_TIME',reqId,(Date.now() - start).toString()));
            res.status(data.getStatusCode());
            res.json(data.getData());
          } catch (e) {
            const message: string = e.role === 1 ? e.message : msgConstant.ERROR_MSG;
            const status: number = e.role === 1 ? e.status : 500;
            const data: JsonRespone<any> = new JsonRespone({status, message});
            res.status(status);
            res.json(data.getData());
            logger.error(`${reqId} : ${e.stack}`);
          }
        });
      });
    });
  }
}

export default new App().app;