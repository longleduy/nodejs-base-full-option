import mongoose from 'mongoose';
//Utils
import LoggerUtil from './Logger.util';
//Constants
import {msgConstant} from '../constants/index';

class MongoUtil{
  constructor() {
  }
  public connect(): void{
    try {
      LoggerUtil.logger.info(msgConstant.MONGOOSE_CONNECTING);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', false);
      mongoose.set('useNewUrlParser', true);
      process.env.MONGO_LOG === "1" && mongoose.set("debug", (collectionName:any, method: any, query: any, doc: any) => {
        LoggerUtil.logger.info(`MONGODB: ${collectionName}.${method} ${JSON.stringify(query)} ${JSON.stringify(doc)}`,);
      });
      mongoose.connect(process.env.MONGODB_PATH as string, {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
        LoggerUtil.logger.info(`${msgConstant.MONGOOSE_CONECTED}`);
        mongoose.connection.on('disconnected',  () => {
          setTimeout( () => {
            LoggerUtil.logger.info(msgConstant.MONGOOSE_RECONECT);
            this.connect();
          }, 2000);
        });
      }).catch(err =>{
        LoggerUtil.logger.error(err.stack);
        setTimeout( () => {
          this.connect();
        }, 2000);
      }) ;
    } catch (error) {
      LoggerUtil.logger.error(error.stack);
    }
  }
}
export default new MongoUtil();