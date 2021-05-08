import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export class TimetableSettingInterceptor extends BaseValidateInterceptor {
  getSchema = () => Joi.object({
      startTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/).required(),
      endTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/).required(),
      alias: Joi.string().required(),
      status: Joi.boolean().optional()
    })
}
