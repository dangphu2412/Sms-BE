import { SchemaValidatorBuilder } from 'core/utils/schema.builder';
import Joi from 'joi';

export const deleteMemberSchema = Joi.object({
    deleteIds: Joi.array().items(SchemaValidatorBuilder.getIdObjectBuilder()).required()
});
