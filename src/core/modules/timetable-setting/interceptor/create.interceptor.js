import { DAY_OF_WEEK } from 'core/common/enum';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const createTimetableSettingInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        dayOfWeek: Joi.number().valid(...Object.values(DAY_OF_WEEK)),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        name: Joi.string().required(),
        isActive: Joi.boolean().optional(),
    })
);
