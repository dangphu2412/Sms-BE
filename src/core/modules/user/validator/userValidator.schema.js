import { SocialKind } from 'core/common/enum/social.enum';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';
import { UserStatus } from '../../../common/enum';

const profileSchema = Joi.object().keys({
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
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    fingerprint: Joi.string().optional(),
    status: Joi.number()
        .valid(UserStatus.AVAILABLE, UserStatus.PENDING, UserStatus.SUSPEND)
        .optional(),
    profile: profileSchema.optional(),
});
