/* eslint-disable max-len */
import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { TIMETABLE_REQUEST_TYPE, APPROVAL_STATUS } from 'core/common/enum/timetableRequest.enum';

const schema = extendBaseModel({
    type: {
        type: String,
        enum: Object.values(TIMETABLE_REQUEST_TYPE),
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
        }
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
    approvalStatus: {
        type: String,
        enum: Object.values(APPROVAL_STATUS),
        default: APPROVAL_STATUS.PENDING
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
});

export const TimetableRequestModel = model('timetable_requests', schema);
