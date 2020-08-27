const ERROR_GET_PORT = 'Error to get ports';
const LISTENING_ON_PORT = 'Express server listening on port';
const PY_SERVICE_ERROR = 'Py service error!';
const REDIS_CONNECTING = 'RedisDB connecting...';
const REDIS_CONNECTED = 'RedisDB connected!';
const GRPC_CREATED = 'GRPC client created!';
const MONGOOSE_CONECTED = 'MongoDB connected!';
const MONGOOSE_CONNECTING = 'MongoDB connecting...';
const MONGOOSE_RECONECT = 'MongoDB Reconnecting...';
//LOG
const PROCESS_TOTAL_TIME = `PROCESS @1 Total time: @2ms`;
// ERROR
const ERROR_INVALID_PARAM = 'Invalid parameter!';
const ERROR_MSG = 'Something went wrong!';
const getMsg: Function = function getMsg(): string{
  let msg: string = eval(arguments[0]);
  for(let i = 1;i<arguments.length;i++){
    msg =  msg.replace(`@${i}`,arguments[i]);
  }
  return msg;
};
export default {
  ERROR_GET_PORT,
  LISTENING_ON_PORT,
  PY_SERVICE_ERROR,
  REDIS_CONNECTING,
  REDIS_CONNECTED,
  GRPC_CREATED,
  ERROR_INVALID_PARAM,
  MONGOOSE_CONECTED,
  MONGOOSE_CONNECTING,
  MONGOOSE_RECONECT,
  ERROR_MSG,
  getMsg
}