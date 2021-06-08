import { model } from 'mongoose';
import { extendBaseModel } from 'core/infrastructure/model';
import { DAY_OF_WEEK } from 'core/common/enum';

const schema = extendBaseModel({
    dayOfWeek: { type: Number, required: true, enum: Object.values(DAY_OF_WEEK) },
    name: { type: String, required: true },
    startTime: { type: String, required: [true, 'startTime is empty'] },
    endTime: { type: String, required: [true, 'endTime is empty'] },
    isActive: { type: Boolean, default: true },
});

export const TimetableSettingModel = model(
    'timetable_settings',
    schema,
);
