import { responseJoiError } from '../../../utils';
import { profileSchema } from './userValidator.schema';

export class UpdateProfileInterceptor {
    intercept(req, res, next) {
        const result = profileSchema.validate(req['body']);
        if (result.error) {
            return responseJoiError(res, result.error);
        }
        return next();
    }
}
