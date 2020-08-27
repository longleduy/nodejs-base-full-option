export default class ServiceError extends Error{
  name: string = 'ServiceError';
  message: string;
  code: string = 'SERVICE_ERROR';
  role: number = 1; // Return msg error to client
  stack?: string = '';
  status: number = 500;
  constructor(stack?: string) {
    super();
    this.message = `Service not available! `;
    this.stack = stack? `${this.code}
    ${stack}` : this.message;
  }
}