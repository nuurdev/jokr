import mongoose from 'mongoose';

export interface UserDoc extends mongoose.Document {
  username: {
    type: string;
    required: boolean;
    unique: boolean;
  };
  email: {
    type: string;
    unique: boolean;
    required: boolean;
  };
  password: {
    type: string;
    required: boolean;
  };
}
