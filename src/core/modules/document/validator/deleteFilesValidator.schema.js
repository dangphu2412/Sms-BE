import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export const deleteMediasSchema = Joi.object({
    ids: Joi.array().items(SchemaValidatorBuilder.getOptionalStringBuilder())
        .min(1).required(),
});
