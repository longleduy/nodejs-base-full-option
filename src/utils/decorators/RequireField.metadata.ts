import 'reflect-metadata';
import {IRouteDefinition} from "../definitions/Route.definition";

export function RequireField() {
  return function (target: Object, propertyName: string): void {
    if (!Reflect.hasMetadata('Require', target)) {
      Reflect.defineMetadata('Require', [], target);
    };
    let list: string[] = Reflect.getMetadata('Require', target);
    list.push(propertyName);
    Reflect.defineMetadata('Require', list, target);
  };
};