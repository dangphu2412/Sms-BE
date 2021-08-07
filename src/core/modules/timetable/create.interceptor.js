/* eslint-disable max-classes-per-file */
import Joi from 'joi';
import { TIMETABLE_TYPE } from 'core/common/enum';
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils/joi.util';

export class CreateTimetableMemberInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.array().items(
        Joi.object({
            userId: JoiUtils.objectId().required(),
            type: Joi.string()
                .valid(TIMETABLE_TYPE.PERMANENT, TIMETABLE_TYPE.TEMP)
                .required(),
            registerTimeId:
                    JoiUtils.objectId().required(),
            activityId:
                    JoiUtils.objectId().required(),
            startDate: JoiUtils.date().required(),
            endDate: JoiUtils.date().optional().default(null),
            isActive: Joi.boolean().required(),
            isApproved: Joi.boolean().optional().default(false),
        }),
    );
}

export class CreateTimetableGroupInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.array().items(Joi.object({
        groupId: JoiUtils.objectId().required(),
        type: Joi.string()
            .valid(TIMETABLE_TYPE.PERMANENT, TIMETABLE_TYPE.TEMP)
            .required(),
        registerTimeId:
                    JoiUtils.objectId().required(),
        activityId:
                    JoiUtils.objectId().required(),
        startDate: JoiUtils.date().required(),
        endDate: JoiUtils.date().optional().default(null),
        isActive: Joi.boolean().required(),
        isApproved: Joi.boolean().optional().default(false),
    }))
}
