import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor/default-validator.interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const refreshPasswordInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        refreshPasswordToken: JoiUtils.password(true).message('refreshPasswordToken need at least 6 charaters'),
        oldPassword: JoiUtils.password(true).message('oldPassword need at least 6 charaters'),
        newPassword: JoiUtils.password(true).message('newPassword need at least 6 charaters'),
    })
);
