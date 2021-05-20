import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { Role, UserStatus } from '../../../common/enum';

const DEFAULT_AVATAR = 'https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg';

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
        default: '$2a$10$EMMT7d0DBqJVGOu8xu7JSOsCWsEslAolZJfckvOFsaPJA9Vot8sKi'
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
        schema: { type: String, enum: [Role.LEADER, Role.ADMIN, Role.MEMBER] }
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
    avatar: {
        type: String,
        default: DEFAULT_AVATAR
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    deletedAt: { type: Date, default: null },
});

export const UserModel = model('users', schema);
