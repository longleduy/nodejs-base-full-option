import {Request} from "express";
export interface ISearchQuery extends Request{
  query: {
    userName?: string | string[],
  };
}