/* eslint-disable max-len */
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetableRequest.enum';
import Joi from 'joi';

export class CreateTimetableRequestInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object().keys({
        userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
        type: Joi.string().valid(TIMETABLE_REQUEST_TYPE.OUT, TIMETABLE_REQUEST_TYPE.ABSENT_ADD, TIMETABLE_REQUEST_TYPE.ABSENT, TIMETABLE_REQUEST_TYPE.LATE, TIMETABLE_REQUEST_TYPE.SOON, TIMETABLE_REQUEST_TYPE.ADD).required(),
        description: Joi.string().required(),
        attachment: SchemaValidatorBuilder.getOptionalStringBuilder().optional(),
        tempTimetables: Joi.array().items(Joi.object().keys({
            userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
            groupId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
            timetableId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
            registerTime: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
            appliedDate: SchemaValidatorBuilder.getDateBuilder().required(),
            type: Joi.string().valid(TIMETABLE_REQUEST_TYPE.OUT, TIMETABLE_REQUEST_TYPE.ABSENT_ADD, TIMETABLE_REQUEST_TYPE.ABSENT, TIMETABLE_REQUEST_TYPE.LATE, TIMETABLE_REQUEST_TYPE.SOON, TIMETABLE_REQUEST_TYPE.ADD).required(),
            customStartTime: Joi.string().optional(),
            customEndTime: Joi.string().optional()
        })),
        isApproved: Joi.boolean().valid(false).optional(),
    })
}
