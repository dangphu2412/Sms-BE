import { Schema, model } from 'mongoose';

const schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Group name is empty'],
    },
    description: {
        type: String,
        trim: true,
    },
    childs: [{
        type: Schema.Types.ObjectId,
        ref: 'groups'
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'groups',
        default: null
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
});

schema.pre('save', function onSave(next) {
    this.updatedAt = Date.now();
    return next();
});

export const GroupModel = model('groups', schema);
