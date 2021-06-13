import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import { TIMETABLE_TYPE } from 'core/common/enum/timetable.enum';
import Joi from 'joi';

export class CreateFormInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object.key({
        userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
        reason: Joi.string().required(),
        type: Joi.string().required(),
        isApprove: Joi.boolean().required().default(false),
        timetables: Joi.array().items(Joi.object.key({
            userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
            groupId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
            registerTime: SchemaValidatorBuilder.getDateBuilder().required(),
            type: Joi.string().required().default(TIMETABLE_TYPE.TEMP).valid(TIMETABLE_TYPE.TEMP, TIMETABLE_TYPE.PERMANENT),
            activities: Joi.array().items(SchemaValidatorBuilder.getIdObjectBuilder()).unique().required(),
            startDate: SchemaValidatorBuilder.getDateBuilder().required(),
            endDate: SchemaValidatorBuilder.getDateBuilder().required(),
            isApprove: Joi.boolean().reequired().default(false),
            isActive: Joi.boolean().optional().default(true),
        })),
        attachment: SchemaValidatorBuilder.getOptionalStringBuilder(),
    })
}
