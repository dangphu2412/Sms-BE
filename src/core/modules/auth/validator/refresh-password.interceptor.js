import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor/default-validator.interceptor';
import Joi from 'joi';

export const refreshPasswordInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        refreshPasswordToken: Joi.string().required(),
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
    })
);
