import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from '../../../utils';

export const deleteMediasInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        ids: JoiUtils.requiredString()
    })
);
