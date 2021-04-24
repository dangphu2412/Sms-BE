import { responseJoiError } from '../../../utils';
import { createUserSchema } from './userValidator.schema';

export class CreateUserInterceptor {
    async intercept(req, res, next) {
        const result = await createUserSchema.validate(req['body']);

        if (result.error) {
            return responseJoiError(res, result);
        }

        return next();
    }
}