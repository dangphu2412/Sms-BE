import { APPROVAL_STATUS } from 'core/common/enum';
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export class ActionTimetableRequestInterceptor extends BaseValidateInterceptor {
    getSchema=() => Joi.object.keys({
        approvalStatus: Joi.string().required().valid(...Object.values(APPROVAL_STATUS.REJECTED, APPROVAL_STATUS.APPROVED))
    })
}
