/* eslint-disable max-len */
import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetable-request.enum';

const schema = extendBaseModel({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: [true, 'userId is empty']
    },
    type: {
        type: String,
        default: TIMETABLE_REQUEST_TYPE.ABSENT_ADD,
        enum: Object.values(TIMETABLE_REQUEST_TYPE),
        require: [true, 'type of form is empty']
    },
    timetable: {
        type: Schema.Types.ObjectId,
        ref: 'timetables',
        default: null
    },
    appliedDate: {
        type: Date,
        require: [true, 'applied date is empty']
    },
    registerTime: {
        type: Schema.Types.ObjectId,
        ref: 'timetable_settings',
        default: null
    },
    customStartTime: {
        type: String,
        default: null
    },
    customEndTime: {
        type: String,
        default: null
    }
});

export const TempTimetableModel = model('temp_timetables', schema);
