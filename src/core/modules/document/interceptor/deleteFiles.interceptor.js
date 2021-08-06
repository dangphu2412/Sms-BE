import Joi from 'joi';
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from '../../../utils';

export class DeleteMediasInterceptor extends BaseValidateInterceptor {
  getSchema = () => Joi.object({
      ids: JoiUtils.optionalStrings().required()
  });
}
