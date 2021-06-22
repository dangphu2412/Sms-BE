import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export const deleteFilesSchema = Joi.object({
    fileIds: Joi.array().items(SchemaValidatorBuilder.getOptionalStringBuilder())
        .min(1).required(),
});
