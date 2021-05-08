import { responseJoiError } from '../../../utils';
import { upsertUserSchema } from './userValidator.schema';

export class CreateUserInterceptor {
    async intercept(req, res, next) {
        const result = await upsertUserSchema.validate(req['body']);

        if (result.error) {
            return responseJoiError(res, result);
        }

        return next();
    }
}
