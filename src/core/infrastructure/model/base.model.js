import { Schema } from 'mongoose';

export const BaseModel = new Schema({
    deletedAt: { type: Date, default: null },
});
