export type RequestMethod = 'get' | 'post' | 'delete' | 'options' | 'put';
export interface IRouteDefinition {
    path: string;
    requestMethod: RequestMethod;
    methodName: string | symbol;
}