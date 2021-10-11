import { model, Schema } from 'mongoose';

const schema = new Schema({
    description: { type: String, required: true },
});

export const ActivityModel = model('activities', schema);
