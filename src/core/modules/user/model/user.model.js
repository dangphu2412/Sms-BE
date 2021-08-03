import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { Role, UserStatus } from '../../../common/enum';
import { saveFullNameHook } from './hooks';

const schema = extendBaseModel({
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
        default: '$2b$10$tJvN9XpgtetH7vkscie.YeakA/R2mxaI5bklFp1Khsc8jtL.OGqyK'
    },
    fingerPrint: { type: String, default: null },
    status: {
        type: String,
        default: UserStatus.AVAILABLE,
        enum: [UserStatus.AVAILABLE, UserStatus.PENDING, UserStatus.SUSPEND]
    },
    roles: {
        type: Array,
        default: [Role.MEMBER],
        schema: { type: String, enum: [Role.LEADER, Role.ADMIN, Role.MEMBER] }
    },
    profile: {
        firstName: { type: String, trim: true, default: null },
        lastName: { type: String, trim: true, default: null },
        fullName: {
            type: String, trim: true, default: null
        },
        birthday: { type: Date, default: null },
        phone: { type: String, trim: true, default: null },
        hometown: { type: String, default: null },
        gender: { type: Boolean, default: null },
        facebook: { type: String, trim: true, default: null },
        universityId: { type: Schema.Types.ObjectId, ref: 'University', default: null },
    },
    avatar: {
        type: String,
        default: 'https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg'
    },
    isPasswordChanged: {
        type: Boolean,
        default: false
    },
    remainingLoginTimes: {
        type: Number,
        default: 3
    },
    specializedGroup: {
        type: Schema.Types.ObjectId,
        ref: 'groups',
        default: null
    },
    deletedAt: { type: Date, default: null },
});
schema.pre(['save', 'updateOne'], saveFullNameHook);
schema.index({ 'profile.fullName': 'text' });
export const UserModel = model('users', schema);
