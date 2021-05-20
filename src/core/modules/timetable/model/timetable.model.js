import { extendBaseModel } from 'core/infrastructure/model';
import { Types, model } from 'mongoose';
import { ActivityModel } from 'core/modules/activity/model/activity.model';
import { TimetableSettingModel } from '../../timetableSetting/model/timetableSetting.model';

const schema = extendBaseModel({
    userId: { type: String, required: true },
    dayOfWeek: {
    // Day in week registered Sun-0, Mon-1, Tue-2
        type: Number,
        required: true,
    },
    type: {
    // Type of timetable // permanent / temptation
        type: String,
        required: true,
    },
    registerTime: {
        type: TimetableSettingModel.schema,
        require: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        default: null,
    },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    activities: {
        type: [Types.ObjectId],
        ref: ActivityModel,
    },
});

export const TimetableModel = model(
    'timetables',
    schema,
);
