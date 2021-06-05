import { extendBaseModel } from 'core/infrastructure/model';
import { Types, model } from 'mongoose';
import { ActivityModel } from 'core/modules/activity/model/activity.model';
import { UserModel } from 'core/modules/user/model/userModel';
import { GroupModel } from 'core/modules/group/model/groupModel';
import { TimetableSettingModel } from '../../timetableSetting/model/timetableSetting.model';

const schema = extendBaseModel({
    userId: { type: Types.ObjectId, default: null, ref: UserModel },
    groupId: { type: Types.ObjectId, default: null, ref: GroupModel },
    type: {
        // Type of timetable // permanent , temporary
        type: String,
        required: true,
    },
    registerTime: {
        type: TimetableSettingModel.schema,
        require: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        default: null,
    },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    activities: {
        type: [Types.ObjectId],
        ref: ActivityModel,
    },
});

export const TimetableModel = model('timetables', schema);
