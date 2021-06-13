import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import { TIMETABLE_TYPE } from 'core/common/enum/timetable.enum';
import Joi from 'joi';

export class CreateFormInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object().keys({
        userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
        reason: Joi.string().required(),
        type: Joi.string().required(),
        isApproved: Joi.boolean().optional(),
        timetables: Joi.array().items(Joi.object().keys({
            userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
            groupId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
            registerTime: SchemaValidatorBuilder.getIdObjectBuilder().required(),
            type: Joi.string().optional().valid(TIMETABLE_TYPE.TEMP, TIMETABLE_TYPE.PERMANENT),
            activities: Joi.array().items(SchemaValidatorBuilder.getIdObjectBuilder()).unique().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            isApprove: Joi.boolean().optional(),
            isActive: Joi.boolean().optional(),
        })),
        attachment: SchemaValidatorBuilder.getOptionalStringBuilder(),
    })
}
