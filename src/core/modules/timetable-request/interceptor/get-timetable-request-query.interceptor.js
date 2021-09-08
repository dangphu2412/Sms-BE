import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum';
import { TIMETABLE_REQUEST_STATUS } from 'core/common/enum/timetable-request-status.enum';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const getTimetableRequestQueryInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        type: Joi.string().valid(...Object.values(TIMETABLE_REQUEST_TYPE)).optional(),
        status: Joi.string().valid(...Object.values(TIMETABLE_REQUEST_STATUS)).optional(),
        search: JoiUtils.optionalString(),
    })
);
