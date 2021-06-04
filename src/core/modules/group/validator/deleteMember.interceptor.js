import { responseJoiError } from '../../../utils';
import { deleteMemberSchema } from './deleteMember.schema';

export class DeleteMemberInterceptor {
    async intercept(req, res, next) {
        const result = deleteMemberSchema.validate(req['body']);

        if (result.error) {
            return responseJoiError(res, result.error);
        }
        return next();
    }
}
