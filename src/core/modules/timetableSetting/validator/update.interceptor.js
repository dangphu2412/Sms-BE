import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export class UpdateTimetableSettingInterceptor extends BaseValidateInterceptor {
  getSchema = () => Joi.object({
      isActive: Joi.boolean().required(),
  });
}
