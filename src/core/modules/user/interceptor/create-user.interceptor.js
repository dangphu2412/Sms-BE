import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { SocialKind, UserStatus } from 'core/common/enum';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const createUserInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        email: JoiUtils.email().required(),
        password: JoiUtils.password().required(),
        fingerprint: JoiUtils.optionalString(),
        status: Joi.string().valid(...Object.values(UserStatus)).optional(),
        specializedGroupId: JoiUtils.objectId().optional(),
        profile: Joi.object().keys({
            firstName: JoiUtils.requiredString(),
            lastName: JoiUtils.requiredString(),
            birthday: Joi.date().timestamp().optional(),
            phone: JoiUtils.phoneNumber().optional(),
            hometown: JoiUtils.optionalString().trim(),
            gender: Joi.boolean().optional(),
            facebook: JoiUtils.social(SocialKind.FACEBOOK).optional(),
            universityId: JoiUtils.objectId().optional()
        }).optional(),
    })
);
