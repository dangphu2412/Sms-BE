import Joi from 'joi';
import { responseJoiError } from '../../../utils';
import { SchemaBuilder } from '../schemaBuilder/schema.builder';

export class IdObjectInterceptor {
    async intercept(req, res, next) {
        const schema = Joi.object({
            id: SchemaBuilder
                .getIdObjectBuilder()
                .message('Url params contain unexpected id format! It should be ObjectId of mongoose')
        });
        const result = await schema.validate(req['params']);

        if (result.error) {
            return responseJoiError(res, result);
        }

        return next();
    }
}
