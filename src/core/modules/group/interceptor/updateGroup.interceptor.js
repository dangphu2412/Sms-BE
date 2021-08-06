import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const updateGroupInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        name: Joi.string().min(0).optional(),
        description: JoiUtils.optionalString().optional(),
        parentId: JoiUtils.objectId().optional(),
        leaderId: JoiUtils.objectId().optional(),
        memberIds: Joi.array().items(JoiUtils.objectId()).unique().optional()
    })
);
