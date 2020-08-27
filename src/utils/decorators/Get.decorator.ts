import { IRouteDefinition } from "../definitions/Route.definition";
export const Get = (path: string): MethodDecorator => {
    return (target, propertyKey) => {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        const routes: IRouteDefinition[] = Reflect.getMetadata('routes', target.constructor);
        routes.push({
            requestMethod: 'get',
            path,
            methodName: propertyKey,
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};