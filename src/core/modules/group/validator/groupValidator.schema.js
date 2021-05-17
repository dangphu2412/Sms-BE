import { SchemaValidatorBuilder } from 'core/utils/schema.builder';
import Joi from 'joi';

export const createGroupSchema = Joi.object({
    name: Joi.string().min(0).required(),
    description: SchemaValidatorBuilder.getOptionalStringBuilder(),
    parentId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
    leaderId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
    memberIds: Joi.array().items(SchemaValidatorBuilder.getIdObjectBuilder()).unique().optional()
});
