import Joi from 'joi';
import { joiFilter } from '../../../utils';

class Validator {
    validatePost() {
        const schema = Joi.object({
            name: Joi.string().min(0).required(),
            description: Joi.string().optional(),
<<<<<<< HEAD
<<<<<<< HEAD
            childIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
            parentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
            leaderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            userIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional()
=======
            childIds: Joi.array().items(Joi.string()).regex(/^[0-9a-fA-F]{24}$/).optional(),
            parentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
            leaderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            userIds: Joi.array().regex(/^[0-9a-fA-F]{24}$/).items(Joi.string()).optional()
>>>>>>> 6ff6bd0 ([SMS-17]:hammer: renaming the query helper, add more validate option)
=======
            childIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).unique().optional(),
            parentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
            leaderId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            userIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).unique().optional()
>>>>>>> b0ae0f0 ([SMS-17]:sparkles: add duplicate validate for req body)
        });
        return joiFilter(schema, 'body');
    }
}
export const GroupValidator = new Validator();
