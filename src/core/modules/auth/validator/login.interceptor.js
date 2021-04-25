import { responseJoiError } from '../../../utils';
import { loginSchema } from './login.schema';

export class LoginInterceptor {
    async intercept(req, res, next) {
        const result = await loginSchema.validate(req['body']);

        if (result.error) {
            return responseJoiError(res, result);
        }

        return next();
    }
}
