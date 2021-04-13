import winston from "winston";
import "winston-daily-rotate-file";
import config from 'config';
import dotenv from 'dotenv';

dotenv.config();
class LoggerUtil {
  logger: winston.Logger;
  loggerConfig: any = config.get('logger');
  constructor() {
    console.log('---------');
    this.init();
  }
  private init():  void{
    const { combine, timestamp,printf } = winston.format;
    const myFormat = printf(({ level, message, timestamp }) => {
      return `${timestamp}: ${level.toUpperCase()}: ${message}`;
    });
    this.logger = winston.createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        myFormat
      ),
      defaultMeta: {
        service: this.loggerConfig.log_service_name
      },
      transports:process.env.NODE_ENV === 'production' && this.loggerConfig.aws_log_type === 'EC2'?[
        new winston.transports.DailyRotateFile({
          datePattern: 'DD-MM-YYYY',
          filename: this.loggerConfig.error_log_path,
          level: 'error'
        }),
        new winston.transports.DailyRotateFile({
          datePattern: 'DD-MM-YYYY',
          filename: this.loggerConfig.debug_log_path,
          level: 'debug'
        })
      ]:[]
    });
    if (process.env.NODE_ENV !== 'production' || this.loggerConfig.aws_log_type === 'CLOUDWATCH') {
      this.logger.add(new winston.transports.Console({
        format: combine(
          timestamp(),
          myFormat
        ),
      }));
    }
  }
}
export default new LoggerUtil().logger;