import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetableRequest.enum';
import { TIMETABLE_REQUEST_STATUS } from 'core/common/enum/timetableRequestStatus.enum';

const schema = extendBaseModel({
    type: {
        type: String,
        default: TIMETABLE_REQUEST_TYPE.ABSENT_ADD,
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
    status: {
        type: String,
        default: TIMETABLE_REQUEST_STATUS.PENDING,
        enum: Object.values(TIMETABLE_REQUEST_STATUS),
    },
});

export const TimetableRequestModel = model('timetable_requests', schema);
