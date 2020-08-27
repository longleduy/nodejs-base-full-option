export interface ISession extends Express.Session {
  userName: string;
  profileName: string,
  token?: string
}