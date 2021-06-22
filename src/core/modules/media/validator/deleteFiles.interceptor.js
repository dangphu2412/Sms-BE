import { responseJoiError } from '../../../utils';
import { deleteFilesSchema } from './deleteFilesValidator.schema';

export class DeleteFilesInterceptor {
    intercept(req, res, next) {
        const result = deleteFilesSchema.validate(req['body']);
        if (result.error) {
            return responseJoiError(res, result.error);
        }

        return next();
    }
}
