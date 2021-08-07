import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';
import { SocialKind } from 'core/common/enum/social.enum';
import { UserStatus } from 'core/common/enum';

export class UpdateProfileInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object().keys({
        status: Joi.string().valid(...Object.values(UserStatus)).optional(),
        profile: Joi.object({
            firstName: JoiUtils.optionalString().min(0).optional(),
            lastName: JoiUtils.optionalString().min(0).optional(),
            gender: Joi.boolean().optional(),
            specializedGroupId: JoiUtils.objectId().optional(),
            universityId: JoiUtils.objectId().optional(),
            birthday: Joi.date().timestamp().optional(),
            phone: JoiUtils.phoneNumber().optional(),
            hometown: Joi.string().optional(),
            facebook: JoiUtils.social(SocialKind.FACEBOOK).optional(),
        })
    })
}
