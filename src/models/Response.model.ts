import {apiConstant} from '../constants';

export default class JsonResponse {
  public status_code: number = apiConstant.DEFAULT_STATUS_CODE;
  public data: any;
  public response_code?: number;
  public respone_msg?: string | null;
  public total_count?: number;
  public page?: number;
  public limit?: number;

  constructor(data: any, status_code?: number, respone_msg?: string, response_code?: number) {
    this.status_code = status_code || 200;
    this.respone_msg = respone_msg;
    this.response_code = response_code;
    this.data = data;
  }

  public getStatusCode(): number {
    return this.status_code;
  }

  public getData(): object {
    return {
      respone_code: this.response_code,
      respone_msg: this.respone_msg,
      total_count: this.total_count,
      limit: this.limit,
      page: this.page,
      data: this.data
    };
  }
}