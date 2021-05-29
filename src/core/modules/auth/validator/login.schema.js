import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export const loginSchema = Joi.object({
    email: SchemaValidatorBuilder.getEmailBuilder().required(),
    password: SchemaValidatorBuilder.getPwdBuilder().required(),
});
