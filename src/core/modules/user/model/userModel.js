import { Schema } from 'mongoose';
import { DatabaseInstance } from '../../../config/database';

const schema = new Schema({
  email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'User email is empty'],
  },
  password: {
      type: String,
      trim: true,
      required: [true, 'User password is empty'],
  },
  roles: [{ type: Schema.Types.ObjectId, ref: 'role' }]
});

// You can define your hook here to create trigger middleware
// Docs: https://mongoosejs.com/docs/middleware.html

export const UserModel = DatabaseInstance
    .buildModel('user', schema);
