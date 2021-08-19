import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { TimetableSettingModel } from 'core/modules/timetable-setting/timetable-setting.model';

const schema = extendBaseModel({
    user: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'users'
    },
    group: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'groups'
    },
    registerTime: {
        type: TimetableSettingModel.schema,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // activities: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'activities',
    //     },
    // ]
});

export const TimetableModel = model('timetables', schema);
