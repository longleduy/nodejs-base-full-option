import mongoose from 'mongoose';
import mongoConnect from 'connect-mongo';
import session from "express-session";
import express from "express";
//Utils
import logger from './Logger.util';
//Constants
import {msgConstant} from '../constants/index';



class MongoUtil{
  mongoSession!: express.RequestHandler;
  public connect(): void{
    try {
      const MongoStore = mongoConnect(session);
      logger.info(msgConstant.MONGOOSE_CONNECTING);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', false);
      mongoose.set('useNewUrlParser', true);
      process.env.MONGO_LOG === "1" && mongoose.set("debug", (collectionName:any, method: any, query: any, doc: any) => {
        logger.info(`MONGODB: ${collectionName}.${method} ${JSON.stringify(query)} ${JSON.stringify(doc)}`,);
      });
      mongoose.connect(process.env.MONGODB_PATH as string, {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
        logger.info(`${msgConstant.MONGOOSE_CONECTED}`);
        mongoose.connection.on('disconnected',  () => {
          setTimeout( () => {
            logger.info(msgConstant.MONGOOSE_RECONECT);
            this.connect();
          }, 2000);
        });
      }).catch(err =>{
        logger.error(err.stack);
        setTimeout( () => {
          this.connect();
        }, 2000);
      }) ;
      this.mongoSession = session({
        secret: process.env.MONGO_SESSION_SECRET as string,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
      })
    } catch (error) {
      logger.error(error.stack);
    }
  }
}
export default new MongoUtil();