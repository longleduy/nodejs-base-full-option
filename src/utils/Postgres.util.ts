import {Pool} from 'pg';
//Utils
import logger from './Logger.util';
//Constans
import {msgConstant} from '../constants/index';
import dotenv from 'dotenv';

dotenv.config();
class PostgresUtil {
  pool: Pool;
  public connect(): void{
    this.pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT),
    });
    this.pool.connect((err: Error) => {
      logger.info(msgConstant.POSTGRES_CONNECTING);
      if (err) {
        logger.error(`${msgConstant.POSTGRES_ERROR} ${err}`);
        setTimeout(() => {
          this.connect();
        },2000)
      }
      else{
        logger.info(msgConstant.POSTGRES_CONNECTED);
      }
    });
  }
}
export default new PostgresUtil();
