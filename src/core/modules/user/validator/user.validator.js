import Joi from 'joi';
import { joiFilter } from '../../../utils';

class Validator {
    validateParam() {
      const schema = Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('ID param is not ObjectID pattern')
      });
      return joiFilter(schema, 'params');
    }

    validateQuery() {
      const schema = Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
      });
      return joiFilter(schema, 'query');
    }

    validatePost() {
      const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        roles: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Role is not ObjectID pattern')).optional(),
      });
      return joiFilter(schema, 'body');
    }

    validatePatch() {
      const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).optional(),
        roles: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Role is not ObjectID pattern')).optional(),
      });
      return joiFilter(schema, 'body');
    }

    // Add your own custom validators here
}

export const UserValidator = new Validator();
