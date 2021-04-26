import Joi from 'joi';
import { joiFilter } from '../../../utils';

class Validator {
    validatePost() {
        const schema = Joi.object({
            name: Joi.string().min(0).required(),
            description: Joi.string().optional(),
            childIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
            parentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
            leaderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            userIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional()
        });
        return joiFilter(schema, 'body');
    }
}
export const GroupValidator = new Validator();
