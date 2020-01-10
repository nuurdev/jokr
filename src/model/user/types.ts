import mongoose from 'mongoose';

export interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
}
