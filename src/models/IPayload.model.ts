import {UserRoleType} from "./Types.model";

class IPayload {
  userName: string
  userId: string
  userRole: UserRoleType
  token?: string
}
export {
  IPayload
}