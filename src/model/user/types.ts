import mongoose from 'mongoose';

export interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  confirmEmailToken: string;
  confirmEmailExpires: Date;
}
