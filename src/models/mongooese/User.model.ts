import { prop, getModelForClass } from '@typegoose/typegoose';
import {UserRoleType} from "../Types.model";

class User {
  @prop({required: true, unique: true})
  userName: string;
  @prop({required: true})
  passWord: string;
  @prop({enum: ['MEMBER', 'ADMIN', 'VIP'],default: 'MEMBER'})
  role?: UserRoleType;
  @prop({default: false})
  active?: boolean;

}
const UserModel = getModelForClass(User);
export {
  UserModel,
    User
}
