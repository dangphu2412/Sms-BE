import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetable-request.enum';
import { TIMETABLE_REQUEST_STATUS } from 'core/common/enum/timetable-request-status.enum';
import { TempTimetableModel } from 'core/modules/temp-timetables';

const schema = extendBaseModel({
    type: {
        type: String,
        enum: Object.values(TIMETABLE_REQUEST_TYPE),
        require: [true, 'type of form is empty']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'user ID is empty'],
    },
    tempTimetables: [
        {
            type: TempTimetableModel.schema,
            require: true,
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
        default: TIMETABLE_REQUEST_STATUS.PENDING,
        enum: Object.values(TIMETABLE_REQUEST_STATUS),
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null
    }
});

export const TimetableRequestModel = model('timetable_requests', schema);
