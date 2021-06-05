import { DAY_OF_WEEK } from 'core/common/enum';
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidatorBuilder } from 'core/utils';
import Joi from 'joi';

export class CreateTimetableSettingInterceptor extends BaseValidateInterceptor {
    getSchema = () => Joi.object({
        dayOfWeek: Joi.number().valid(Object.values(DAY_OF_WEEK)),
        startTime: SchemaValidatorBuilder.getDateBuilder().required(),
        endTime: SchemaValidatorBuilder.getDateBuilder().required(),
        name: Joi.string().required(),
        isActive: Joi.boolean().optional(),
    });
}
