import Joi from 'joi';
import { UserStatus } from '../../../common/enum';
import { SchemaBuilder } from '../../interceptor/schemaBuilder/schema.builder';

const profileSchema = Joi.object().keys({
    firstName: SchemaBuilder.getOptionalStringBuilder().min(0),
    lastName: SchemaBuilder.getOptionalStringBuilder().min(0),
    birthday: Joi.date().timestamp().optional(),
    phone: SchemaBuilder.getOptionalStringBuilder(),
    hometown: Joi.string().optional(),
    gender: Joi.boolean().optional(),
    facebook: Joi.string().regex(/(https?:\/\/www.facebook|fb|m\.facebook)\.(?:com|me)\/(\w+)?\/?/i).optional(),
    universityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
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
