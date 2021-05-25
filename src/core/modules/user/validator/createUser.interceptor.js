import { responseJoiError } from '../../../utils';
import { upsertUserSchema } from './userValidator.schema';

export class CreateUserInterceptor {
    intercept(req, res, next) {
        const result = upsertUserSchema.validate(req['body']);
        if (result.error) {
            return responseJoiError(res, result.error);
        }

        return next();
    }
}
