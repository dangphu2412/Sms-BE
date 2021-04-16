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
      name: Joi.string().required(),
      permissions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Permission is not ObjectID pattern')).optional(),
    });
    return joiFilter(schema, 'body');
  }

  validatePatch() {
    const schema = Joi.object({
      name: Joi.string().optional(),
      permissions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Permission is not ObjectID pattern')).optional(),
    });
    return joiFilter(schema, 'body');
  }

  // Add your own custom validators here
}

export const RoleValidator = new Validator();
