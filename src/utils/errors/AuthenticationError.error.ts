export default class AuthenticationError extends Error{
  name: string = 'AuthenticationError';
  message: string;
  code: string = 'AUTHENTICATION_ERROR';
  role: number = 1; // Return msg error to client
  status: number = 403;
  constructor () {
    super();
    this.message = `Permission denied`;
  }
}