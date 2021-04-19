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
      minlength: 6,
      required: [true, 'User password is empty'],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  fingerPrint: { type: String, default: null },
  profile: {
      firstName: { type: String, trim: true, default: null },
      lastName: { type: String, trim: true, default: null },
      birthday: { type: Date, default: null },
      hometown: { type: String, default: null },
      phone: { type: String, trim: true, default: null },
      university: { type: Schema.Types.ObjectId, ref: 'University', default: null },
  },
  address: { type: String, default: null },
  facebook: { type: String, trim: true, default: null },
  gender: { type: Boolean, default: null },
  status: { type: String, default: null, enum: ['AVAILABLE', 'PENDING', 'SUSPEND', null] },
  roles: [{ type: String, default: null }]
});

// eslint-disable-next-line prefer-arrow-callback
// eslint-disable-next-line func-names
schema.pre('save', function (next) {
    this.updatedAt = Date.now();
    return next();
});
export const UserModel = DatabaseInstance
    .buildModel('user', schema);
