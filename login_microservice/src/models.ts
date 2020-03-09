import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  admin: boolean;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  admin: {
    type: Boolean,
    required: true
  }
});

export default mongoose.model<IUser>("User", UserSchema);
