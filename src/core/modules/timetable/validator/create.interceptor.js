import Joi from 'joi';
import { TIMETABLE_TYPE } from 'core/common/enum';
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils/schema.builder';

export class CreateTimetableInterceptor extends BaseValidateInterceptor {
  getSchema = () => Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.number().min(0).max(7),
        userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
        type: Joi.string()
          .valid(TIMETABLE_TYPE.PERMANENT, TIMETABLE_TYPE.TEMP)
          .required(),
        registerTimeId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
        activityId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
        startDate: SchemaValidatorBuilder.getDateBuilder().required(),
        endDate: SchemaValidatorBuilder.getDateBuilder().required(),
        isActive: Joi.boolean().required(),
        isApproved: Joi.boolean().optional().default(false),
      })
    );
}
