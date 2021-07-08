import { responseJoiError } from 'core/utils';
import { CreateTimetableRequestSchema } from './createTimetableRequest.schema';

export class CreateTimetableRequestInterceptor {
    async intercept(req, res, next) {
        const data = new CreateTimetableRequestSchema(req['body'].type);
        const result = data.getSchema().validate(req['body']);
        if (result.error) {
            return responseJoiError(res, result.error);
        }
        return next();
    }
}
