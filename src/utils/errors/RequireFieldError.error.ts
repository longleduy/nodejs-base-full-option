import IErrorInfo from "./IErrorInfo.interface";

export default class RequireFieldError extends Error{
  name: string = 'RequireFieldError';
  message: string;
  code: string = 'REQUIRE_FIELD_ERROR';
  role: number = 1; // Return msg error to client
  status: number = 500;
  constructor (field:string) {
    super();
    this.message = `Field require (${field})`;
  }
}