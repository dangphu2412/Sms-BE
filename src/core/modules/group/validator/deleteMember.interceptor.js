import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export class DeleteMemberInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object({
        deleteIds: Joi.array().items(SchemaValidatorBuilder.getIdObjectBuilder()).required()
    })
}
