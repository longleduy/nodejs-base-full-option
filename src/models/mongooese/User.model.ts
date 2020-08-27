import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: {type: String,unique: true, required: true},
  passWord: {type: String},
  profileName: {type: String},
  active: {type: Boolean,default: false}
});
export const userModel = mongoose.model('users',userSchema);