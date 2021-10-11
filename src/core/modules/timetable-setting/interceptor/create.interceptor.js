import { DAY_OF_WEEK } from 'core/common/enum';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const createTimetableSettingInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        dayOfWeek: Joi.number().valid(...Object.values(DAY_OF_WEEK)),
        startTime: JoiUtils.date().required(),
        endTime: JoiUtils.date().required(),
        name: JoiUtils.requiredString(),
        isActive: Joi.boolean().optional(),
    })
);
