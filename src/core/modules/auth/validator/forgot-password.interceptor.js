import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor/default-validator.interceptor';
import Joi from 'joi';
import { SchemaValidatorBuilder } from '../../../utils';

export const forgotPasswordInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        email: SchemaValidatorBuilder.getEmailBuilder().required(),
    })
);
