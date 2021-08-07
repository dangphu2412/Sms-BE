import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { SocialKind, UserStatus } from 'core/common/enum';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const createUserInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        email: JoiUtils.email().required(),
        password: JoiUtils.password().optional(),
        fingerprint: Joi.string().optional(),
        status: Joi.number()
            .valid(UserStatus.AVAILABLE, UserStatus.PENDING, UserStatus.SUSPEND)
            .optional(),
        specializedGroupId: JoiUtils.objectId(true)
            .message('Invalid specializedGroupId, should be formatted as Object id'),
        profile: Joi.object().keys({
            firstName: JoiUtils.optionalString().min(0),
            lastName: JoiUtils.optionalString().min(0),
            birthday: Joi.date().timestamp().optional(),
            phone: JoiUtils.phoneNumber().optional(),
            hometown: Joi.string().optional(),
            gender: Joi.boolean().optional(),
            facebook: JoiUtils.social(SocialKind.FACEBOOK).optional(),
            universityId: JoiUtils.objectId().optional(),
        }).optional(),
    })
);
