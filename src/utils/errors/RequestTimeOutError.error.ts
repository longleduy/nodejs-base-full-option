export default class RequestTimeError extends Error{
  name: string = 'RequestTimeError';
  message: string;
  code: string = 'REQUEST_TIMEOUT_ERROR';
  status: number = 503;
  role: number = 1; // Return msg error to client
  constructor() {
    super();
    this.message = `Request timeout! `;
  }
}