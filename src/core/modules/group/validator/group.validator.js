import Joi from 'joi';
import { responseJoiError } from '../../../utils';

class Validator {
    validatePost() {
        const schema = Joi.object({
            name: Joi.string().min(0).required(),
            description: Joi.string().optional(),
            childIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).unique().optional(),
            parentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
            leaderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            userIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).unique().optional()
        });
        return responseJoiError(schema, 'body');
    }
}
export const GroupValidator = new Validator();
