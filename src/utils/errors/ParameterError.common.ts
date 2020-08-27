export default class ParameterError extends Error{
  name: string = 'ParameterError';
  message: string;
  code: string = 'PARAMETER_ERROR';
  role: number = 1; // Return msg error to client
  status: number = 500;
  constructor (field:string) {
    super();
    this.message = `Parameter not invalid (${field})`;
  }
}