import 'reflect-metadata';
import app from './app';
import dotenv from 'dotenv';
dotenv.config();
// Constant
import {msgConstant} from './constants/index';
// Commons
import logger from './utils/Logger.util';

if (!process.env.PORT) {
  logger.info(msgConstant.ERROR_GET_PORT);
  process.exit(1);
};
const PORT: number = parseInt(process.env.PORT as string, 10);
app.listen(PORT, () => {
  logger.info(msgConstant.LISTENING_ON_PORT +' '+ PORT);
});
