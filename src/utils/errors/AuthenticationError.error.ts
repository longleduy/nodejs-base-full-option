export default class AuthenticationError extends Error{
  name: string = 'AuthenticationError';
  message: string;
  code: string = 'AUTHENTICATION_ERROR';
  role: number = 1; // Return msg error to client
  status: number = 403;
  stack: string;
  constructor (err?: Error) {
    super();
    this.message = `Permission denied!`;
    this.stack = `${this.name}: ${this.message}
${err?.stack}`;
  }
}