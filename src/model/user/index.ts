import mongoose from 'mongoose';
import { UserDoc } from './types';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 8
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<UserDoc>('User', userSchema);
