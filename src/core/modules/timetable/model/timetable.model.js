import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { TimetableSettingModel } from 'core/modules/timetableSetting/model/timetableSetting.model';

const schema = extendBaseModel({
    userId: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'users'
    },
    groupId: {
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
