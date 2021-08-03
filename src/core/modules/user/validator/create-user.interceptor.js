import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { SocialKind, UserStatus } from 'core/common/enum';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export const createUserInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        email: SchemaValidatorBuilder.getEmailBuilder().required(),
        password: SchemaValidatorBuilder.getPwdBuilder().optional(),
        fingerprint: Joi.string().optional(),
        status: Joi.number()
            .valid(UserStatus.AVAILABLE, UserStatus.PENDING, UserStatus.SUSPEND)
            .optional(),
        specializedGroupId: SchemaValidatorBuilder.getIdObjectBuilder(true)
            .message('Invalid specializedGroupId, should be formatted as Object id'),
        profile: Joi.object().keys({
            firstName: SchemaValidatorBuilder.getOptionalStringBuilder().min(0),
            lastName: SchemaValidatorBuilder.getOptionalStringBuilder().min(0),
            birthday: Joi.date().timestamp().optional(),
            phone: SchemaValidatorBuilder.getPhoneNumberBuilder().optional(),
            hometown: Joi.string().optional(),
            gender: Joi.boolean().optional(),
            facebook: SchemaValidatorBuilder.getSocialBuilder(SocialKind.FACEBOOK).optional(),
            universityId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
        }).optional(),
    })
);
