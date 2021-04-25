import Joi from 'joi';
import { joiFilter } from '../../../utils';

class Validator {
    validatePost() {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().optional(),
            childIds: Joi.array().items(Joi.string()).optional(),
            parentId: Joi.string().optional(),
            leaderId: Joi.string().required(),
            userIds: Joi.array().items(Joi.string()).optional()
        });
        return joiFilter(schema, 'body');
    }
}
export const GroupValidator = new Validator();
