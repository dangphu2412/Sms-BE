import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const updateTimetableSettingInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        isActive: Joi.boolean().required(),
    })
);
