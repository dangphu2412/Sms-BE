import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum';
import { TIMETABLE_REQUEST_STATUS } from 'core/common/enum/timetableRequestStatus.enum';
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export class GetTimetableRequestQueryInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object({
        type: Joi.string().valid(...Object.values(TIMETABLE_REQUEST_TYPE)).required(),
        status: Joi.string().valid(...Object.values(TIMETABLE_REQUEST_STATUS)).required(),
    })
}
