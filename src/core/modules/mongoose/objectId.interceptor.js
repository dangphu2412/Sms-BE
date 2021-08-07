import Joi from 'joi';
import { responseJoiError, JoiUtils } from '../../utils';

class IdObjectInterceptor {
    async intercept(req, res, next) {
        const schema = Joi.object({
            id: JoiUtils
                .objectId()
        });
        const result = schema.validate(req['params']);
        if (result.error) {
            return responseJoiError(res, result.error);
        }

        return next();
    }
}

export const interceptIdObject = new IdObjectInterceptor();
