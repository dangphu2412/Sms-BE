import { responseJoiError } from '../../../utils';
import { deleteMediasSchema } from './deleteFilesValidator.schema';

export class DeleteMediasInterceptor {
    intercept(req, res, next) {
        const result = deleteMediasSchema.validate(req['body']);
        if (result.error) {
            return responseJoiError(res, result.error);
        }

        return next();
    }
}
