import { SocialKind } from 'core/common/enum/social.enum';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';
import { UserStatus } from '../../../common/enum';

export const profileSchema = Joi.object().keys({
    firstName: SchemaValidatorBuilder.getOptionalStringBuilder().min(0),
    lastName: SchemaValidatorBuilder.getOptionalStringBuilder().min(0),
    birthday: Joi.date().timestamp().optional(),
    phone: SchemaValidatorBuilder.getPhoneNumberBuilder().optional(),
    hometown: Joi.string().optional(),
    gender: Joi.boolean().optional(),
    facebook: SchemaValidatorBuilder.getSocialBuilder(SocialKind.FACEBOOK).optional(),
    universityId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
});

export const upsertUserSchema = Joi.object({
    email: SchemaValidatorBuilder.getEmailBuilder().required(),
    password: SchemaValidatorBuilder.getPwdBuilder().optional(),
    fingerprint: Joi.string().optional(),
    status: Joi.number()
        .valid(UserStatus.AVAILABLE, UserStatus.PENDING, UserStatus.SUSPEND)
        .optional(),
    profile: profileSchema.optional(),
});
