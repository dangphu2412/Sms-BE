import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
// import { TIMETABLE_TYPE } from 'core/common/enum/timetable.enum';

const schema = extendBaseModel({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User ID is empty'],
    },
    type: {
        type: String,
        // default: TIMETABLE_TYPE.TEMP,
        // require: [true, 'Type of permission form is empty']
    },
    reason: {
        type: String,
        trim: true,
        required: [true, 'Reason is empty'],
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    attachment: {
        type: String,
        trim: true
    },
    timetables: [
        {
            type: Schema.Types.ObjectId,
            ref: 'timetables',
            required: [true, 'timetable ID is empty'],
        },
    ],
});

export const FormModel = model('forms', schema);
