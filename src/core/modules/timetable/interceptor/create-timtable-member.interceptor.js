import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils/joi.util';

export const createTimetableMemberInterceptor = new DefaultValidatorInterceptor(
    Joi.array().items(
        Joi.object({
            userId: JoiUtils.objectId().required(),
            registerTimeId: JoiUtils.objectId().required(),
            activityId: JoiUtils.objectId().required(),
            startDate: JoiUtils.date().required(),
            endDate: JoiUtils.date().optional().default(null),
            isActive: Joi.boolean().required(),
            isApproved: Joi.boolean().optional().default(false),
        }),
    )
);
