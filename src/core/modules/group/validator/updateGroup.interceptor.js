import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export class UpdateGroupInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object({
        name: Joi.string().min(0).optional(),
        description: SchemaValidatorBuilder.getOptionalStringBuilder().optional(),
        parentId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
        leaderId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
        memberIds: Joi.array().items(SchemaValidatorBuilder.getIdObjectBuilder()).unique().optional()
    })
}
