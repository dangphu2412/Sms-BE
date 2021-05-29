import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export class CreateTimetableSettingInterceptor extends BaseValidateInterceptor {
  getSchema = () => Joi.object({
      startTime: SchemaValidatorBuilder.getDateBuilder().required(),
      endTime: SchemaValidatorBuilder.getDateBuilder().required(),
      name: Joi.string().required(),
      isActive: Joi.boolean().optional()
  })
}
