interface Option{
  message?: string
  error?: Error
}
class AuthenticationError extends Error{
  name: string = 'AuthenticationError';
  message = 'Permission denied!';
  code: string = 'AUTHENTICATION_ERROR';
  role: number = 1;
  status: number = 403;
  constructor (option?: Option) {
    super();
    this.message = option?.message || `Permission denied!`;
  }
}
export {
  AuthenticationError
}