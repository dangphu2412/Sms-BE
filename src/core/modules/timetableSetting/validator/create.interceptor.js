import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export class TimetableSettingInterceptor extends BaseValidateInterceptor {
  getSchema = () => Joi.object({
      startTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/).required(),
      endTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/).required(),
      name: Joi.string().required(),
      isActive: Joi.boolean().optional()
    })
}
