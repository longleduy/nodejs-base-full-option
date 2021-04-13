import {UserRoleType} from "./Types.model";

interface ISession extends Express.Session {
    userId: string
    userName: string
    token: string
    userRole: UserRoleType
}
export {ISession}