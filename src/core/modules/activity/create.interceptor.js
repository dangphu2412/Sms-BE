import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export class ActivityInterceptor extends BaseValidateInterceptor {
  getSchema = () => Joi.object({
      name: Joi.string().required(),
      isActive: Joi.boolean().optional()
  })
}
