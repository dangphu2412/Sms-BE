import { extendBaseModel } from 'core/infrastructure/model';
import { Schema, model } from 'mongoose';

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
    type: {
        // Type of timetable // permanent , temporary
        type: String,
        required: true,
    },
    registerTime: {
        type: Schema.Types.ObjectId,
        ref: 'timetable_settings',
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
    isApproved: {
        type: Boolean,
        default: false
    },
    activities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'activities',
        },
    ]
});

export const TimetableModel = model('timetables', schema);
