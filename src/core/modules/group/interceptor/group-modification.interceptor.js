import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const groupModificationInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        name: JoiUtils.optionalString(),
        description: JoiUtils.optionalString(),
        tagId: JoiUtils.objectId().optional(),
        parentId: JoiUtils.objectId().optional(),
        leaderId: JoiUtils.objectId().optional(),
        memberIds: Joi.array().items(JoiUtils.objectId()).unique().optional()
    })
);
