import LoggerUtil from '../Logger.util';
export const LogDecorator = (target: any, key: string, descriptor: any) => {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    //FIXME: Remove reqId
    // @ts-ignore
    const reqId: string = args[0].reqId;
    let requestInfo: string = `CLIENT REQUEST  ${reqId} ${args[0].method} ${args[0].headers.host}${args[0].originalUrl}`;
    LoggerUtil.logger.info(requestInfo);
    return originalMethod.apply(this, args);
  };
  return descriptor;
};
