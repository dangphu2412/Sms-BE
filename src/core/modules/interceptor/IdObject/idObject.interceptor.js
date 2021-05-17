import Joi from 'joi';
import { responseJoiError, SchemaValidatorBuilder } from '../../../utils';

export class IdObjectInterceptor {
    async intercept(req, res, next) {
        const schema = Joi.object({
            id: SchemaValidatorBuilder
                .getIdObjectBuilder()
                .message('Url params contain unexpected id format! It should be ObjectId of mongoose')
        });
        const result = schema.validate(req['params']);

        if (result.error) {
            return responseJoiError(res, result);
        }

        return next();
    }
}
