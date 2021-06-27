import { model, Schema } from 'mongoose';

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name of group tag can not be null']
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'groups',
    }],
});

export const GroupTagModel = model('groupTags', schema);
