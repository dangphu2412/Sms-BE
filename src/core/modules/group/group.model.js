import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';

const schema = extendBaseModel({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Group name is empty'],
    },
    description: {
        type: String,
        trim: true,
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'groups',
        },
    ],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'groups',
        default: null,
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
    ],
    groupTag: {
        type: Schema.Types.ObjectId,
        ref: 'groupTags',
        default: null,
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    deletedAt: { type: Date, default: null },
});

export const GroupModel = model('groups', schema);
