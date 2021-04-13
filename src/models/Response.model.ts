import {Paging} from "./Paging.model";

interface Option<T>{
  status?: number
  data?: T
  paging?: Paging
  message?: string
}
export default class JsonResponse<T>{
  status = 200;
  data?: T
  message?: string
  paging?: Paging

  constructor(option?: Option<T>) {
    this.data = option?.data;
    this.message = option?.message;
    this.paging = option?.paging;
    this.status = option?.status || 200;
  }

  public getStatusCode(): number {
    return this.status;
  }

  public getData(): object {
    return {
      data: this.data,
      paging: this.paging,
      message: this.message
    };
  }
}