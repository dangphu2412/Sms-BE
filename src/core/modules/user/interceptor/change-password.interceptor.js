import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const changePasswordInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        oldPassword: JoiUtils.password(true).message('Old password should be 6 character'),
        newPassword: JoiUtils.password(true).message('New password should be 6 character'),
    })
);
