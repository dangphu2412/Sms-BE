import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const groupCreationInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        name: JoiUtils.requiredString(),
        description: JoiUtils.optionalString().trim().min(0),
        tagId: JoiUtils.objectId().required(),
        parentId: JoiUtils.objectId().optional(),
        leaderId: JoiUtils.objectId().required(),
        memberIds: Joi.array().items(JoiUtils.objectId()).unique().optional()
    })
);
