import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';
import { SocialKind } from 'core/common/enum/social.enum';
import { UserStatus } from 'core/common/enum';

export const updateProfileInterceptor = new DefaultValidatorInterceptor(
    Joi.object().keys({
        status: Joi.string().valid(...Object.values(UserStatus)).optional(),
        specializedGroupId: JoiUtils.objectId().optional(),
        profile: Joi.object({
            firstName: JoiUtils.optionalString().trim().min(0),
            lastName: JoiUtils.optionalString().trim().min(0),
            gender: Joi.boolean().optional(),
            universityId: JoiUtils.objectId().optional(),
            birthday: Joi.date().timestamp().optional(),
            phone: JoiUtils.phoneNumber().optional(),
            hometown: JoiUtils.optionalString().trim(),
            facebook: JoiUtils.social(SocialKind.FACEBOOK).optional(),
        })
    })
);
