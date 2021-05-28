import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';
import { SocialKind } from 'core/common/enum/social.enum';

export class UpdateProfileInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object().keys({
        profile: Joi.object({
            firstName: SchemaValidatorBuilder.getOptionalStringBuilder().min(0).optional(),
            lastName: SchemaValidatorBuilder.getOptionalStringBuilder().min(0).optional(),
            gender: Joi.boolean().optional(),
            specializedGroupId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
            universityId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
            birthday: Joi.date().timestamp().optional(),
            phone: SchemaValidatorBuilder.getPhoneNumberBuilder().optional(),
            hometown: Joi.string().optional(),
            facebook: SchemaValidatorBuilder.getSocialBuilder(SocialKind.FACEBOOK).optional(),
        })
    })
}
