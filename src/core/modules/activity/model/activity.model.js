import { extendBaseModel } from 'core/infrastructure/model';
import { model } from 'mongoose';

const schema = extendBaseModel({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
});

export const ActivityModel = model(
    'ActivityModel',
    schema,
    'activities'
);
