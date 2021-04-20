import { Schema } from 'mongoose';
import { DatabaseInstance } from '../../../config/database';
import { Role, UserStatus } from '../../../common/enum';

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
    fingerPrint: { type: String, default: null },
    status: {
            type: Number,
            default: UserStatus.AVAILABLE,
            enum: [UserStatus.AVAILABLE, UserStatus.PENDING, UserStatus.SUSPEND]
        },
    roles: {
            type: Array,
            default: [Role.MEMBER],
            schema: { type: String, enum: [Role.SUPER_ADMIN, Role.ADMIN, Role.MEMBER] }
        },
    profile: {
        firstName: { type: String, trim: true, default: null },
        lastName: { type: String, trim: true, default: null },
        birthday: { type: Date, default: null },
        phone: { type: String, trim: true, default: null },
        hometown: { type: String, default: null },
        gender: { type: Boolean, default: null },
        facebook: { type: String, trim: true, default: null },
        universityId: { type: Schema.Types.ObjectId, ref: 'University', default: null },
        },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
});

schema.pre('save', function onSave(next) {
    this.updatedAt = Date.now();
    return next();
});
export const UserModel = DatabaseInstance
    .buildModel('user', schema);
