import { Schema } from 'mongoose';
import { DatabaseInstance } from '../../../config/database';

const schema = new Schema({
  name: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Role name is empty'],
  },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'permissions' }]
});

// You can define your hook here to create trigger middleware
// Docs: https://mongoosejs.com/docs/middleware.html

export const RoleModel = DatabaseInstance
    .buildModel('role', schema);
