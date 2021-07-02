/* eslint-disable max-len */
import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetableRequest.enum';

const schema = extendBaseModel({
    type: {
        type: String,
        default: TIMETABLE_REQUEST_TYPE.ABSENT_ADD,
        enum: [TIMETABLE_REQUEST_TYPE.OUT, TIMETABLE_REQUEST_TYPE.ABSENT_ADD, TIMETABLE_REQUEST_TYPE.ABSENT, TIMETABLE_REQUEST_TYPE.LATE, TIMETABLE_REQUEST_TYPE.SOON, TIMETABLE_REQUEST_TYPE.ADD],
        require: [true, 'type of form is empty']
    },
    timetableId: {
        type: Schema.Types.ObjectId,
        ref: 'timetables',
        require: [true, 'timetableId is empty']
    },
    appliedDate: {
        type: Date,
        require: [true, 'applied date is empty']
    },
    registerTime: {
        type: Schema.Types.ObjectId,
        ref: 'timetable_settings',
        require: [true, 'timetableId is empty']
    },
    customStartTime: {
        type: String,
    },
    customEndTime: {
        type: String,
    }
});

export const TempTimetableModel = model('temp_timetables', schema);
