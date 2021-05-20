import { responseJoiError } from '../../../utils';
import { createGroupSchema } from './groupValidator.schema';

export class CreateGroupInterceptor {
    async intercept(req, res, next) {
        const result = createGroupSchema.validate(req['body']);

        if (result.error) {
            return responseJoiError(res, result);
        }

        return next();
    }
}
