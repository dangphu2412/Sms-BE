import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export const changePasswordInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        oldPassword: SchemaValidatorBuilder.getPwdBuilder(true).message('Old password should be 6 character'),
        newPassword: SchemaValidatorBuilder.getPwdBuilder(true).message('New password should be 6 character'),
    })
);
