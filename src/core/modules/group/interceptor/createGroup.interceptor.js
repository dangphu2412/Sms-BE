import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const createGroupInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        name: Joi.string().min(0).required(),
        description: JoiUtils.optionalString(),
        parentId: JoiUtils.objectId().optional(),
        leaderId: JoiUtils.objectId().required(),
        memberIds: Joi.array().items(JoiUtils.objectId()).unique().optional()
    })
);