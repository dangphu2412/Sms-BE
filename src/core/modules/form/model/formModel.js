import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';
import { TIMETABLE_TYPE } from 'core/common/enum/timetable.enum';

const schema = extendBaseModel({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null,
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
            userId: { type: Schema.Types.ObjectId, ref: 'users' },
            groupId: { type: Schema.Types.ObjectId, ref: 'users' },
            registerTime: { type: Schema.Types.ObjectId, ref: 'TimetableSetting' },
            type: { type: String, default: TIMETABLE_TYPE.TEMP, enum: [TIMETABLE_TYPE.TEMP, TIMETABLE_TYPE.PERMANENT] },
            activities: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'activities',
                },
            ],
            startDate: { type: Date },
            endDate: { type: Date },
            isApproved: { type: Boolean, default: false },
            isActive: { type: Boolean, default: true },
        }
    ],
    createdAt: { type: Date },
    updatedAt: { type: Date },
    deletedAt: { type: Date, default: null },
});

export const FormModel = model('forms', schema);
