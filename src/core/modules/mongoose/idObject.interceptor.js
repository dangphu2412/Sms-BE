import Joi from 'joi';
import { responseJoiError, SchemaValidatorBuilder } from '../../utils';

class IdObjectInterceptor {
    async intercept(req, res, next) {
        const schema = Joi.object({
            id: SchemaValidatorBuilder
                .getIdObjectBuilder()
        });
        const result = schema.validate(req['params']);
        if (result.error) {
            return responseJoiError(res, result.error);
        }

        return next();
    }
}

export const interceptIdObject = new IdObjectInterceptor();
