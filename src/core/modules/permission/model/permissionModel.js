import { Schema } from 'mongoose';
import { DatabaseInstance } from '../../../config/database';

const schema = new Schema({
  name: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Permission name is empty'],
  },
});
// You can define your hook here to create trigger middleware
// Docs: https://mongoosejs.com/docs/middleware.html

export const PermissionModel = DatabaseInstance
    .buildModel('permission', schema);
