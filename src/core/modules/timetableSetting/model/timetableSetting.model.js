import { model } from 'mongoose';
import { extendBaseModel } from 'core/infrastructure/model';

const schema = extendBaseModel({
    name: { type: String, required: true },
    startTime: { type: String, required: [true, 'startTime is empty'] },
    endTime: { type: String, required: [true, 'endTime is empty'] },
    isActive: { type: Boolean, default: true },
});

export const TimetableSettingModel = model(
    'timetable_settings',
    schema,
);
