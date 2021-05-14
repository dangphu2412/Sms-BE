import Joi from 'joi';
import { SchemaBuilder } from '../../interceptor/schemaBuilder/schema.builder';

export const createGroupSchema = Joi.object({
    name: Joi.string().min(0).required(),
    description: SchemaBuilder.getOptionalStringBuilder(),
    childIds: Joi.array().items(SchemaBuilder.getIdObjectBuilder()).unique().optional(),
    parentId: SchemaBuilder.getIdObjectBuilder().optional(),
    leaderId: SchemaBuilder.getIdObjectBuilder(),
    userIds: Joi.array().items(SchemaBuilder.getIdObjectBuilder()).unique().optional()
});
