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
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'user ID is empty'],
    },
    tempTimetables: [
        {
            type: Schema.Types.ObjectId,
            ref: 'temp_timetables',
        },
    ],
    attachment: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'description is empty'],
    },
    isApproved: {
        type: Boolean,
        default: false
    },
});

export const TimetableRequestModel = model('timetable_requests', schema);
