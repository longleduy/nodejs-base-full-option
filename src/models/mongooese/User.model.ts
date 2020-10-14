import { prop, getModelForClass } from '@typegoose/typegoose';

class User {
  @prop({required: true, unique: true})
  userName?: string;
  @prop()
  passWord?: string;
  @prop()
  profileName?: string;
  @prop({default: false})
  active?: boolean;
}
export const UserModel = getModelForClass(User);
