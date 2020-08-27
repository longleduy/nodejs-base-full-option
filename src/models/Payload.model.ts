export default class Payload {
  userName: string;
  profileName: string;
  token?: string;
  constructor(userName: string, profileName: string) {
    this.userName = userName;
    this.profileName = profileName;
  }
}