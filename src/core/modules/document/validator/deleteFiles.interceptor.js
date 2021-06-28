import Joi from 'joi';
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from '../../../utils';

export class DeleteMediasInterceptor extends BaseValidateInterceptor {
  getSchema = () => Joi.object({
      ids: SchemaValidatorBuilder.getArrayOptionalStringBuilder().required()
  });
}
