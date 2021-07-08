import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetableRequest.enum';
import { responseJoiError } from 'core/utils';
import Joi from 'joi';

export class CreateTimetableRequestQueryInterceptor {
    async intercept(req, res, next) {
        const querySchema = Joi.string().valid(...Object.values(TIMETABLE_REQUEST_TYPE));
        const result = querySchema.validate(req['query'].type);
        if (result.error) {
            return responseJoiError(res, result.error);
        }
        return next();
    }
}
