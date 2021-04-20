import Joi from 'joi';
import { joiFilter } from '../../../utils';
import { UserStatus } from '../../../common/enum';

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
      const profileSchema = Joi.object().keys({
        firstName: Joi.string().min(0).optional(),
        lastName: Joi.string().min(0).optional(),
        birthday: Joi.date().timestamp().optional(),
        phone: Joi.string().optional(),
        hometown: Joi.string().optional(),
        gender: Joi.boolean().optional(),
        facebook: Joi.string().regex(/(https?:\/\/www.facebook|fb|m\.facebook)\.(?:com|me)\/(\w+)?\/?/i).optional(),
        universityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
      });
      const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        fingerprint: Joi.string().optional(),
        status: Joi.string()
        .valid(UserStatus.AVAILABLE, UserStatus.PENDING, UserStatus.SUSPEND)
        .optional(),
        profile: profileSchema.optional(),
      });
      return joiFilter(schema, 'body');
    }

    validatePatch() {
      const profileSchema = Joi.object().keys({
        firstName: Joi.string().min(0).optional(),
        lastName: Joi.string().min(0).optional(),
        birthday: Joi.date().timestamp().optional(),
        phone: Joi.string().optional(),
        hometown: Joi.string().optional(),
        gender: Joi.boolean().optional(),
        facebook: Joi.string().regex(/(https?:\/\/www.facebook|fb|m\.facebook)\.(?:com|me)\/(\w+)?\/?/i).optional(),
        universityId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      });
      const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).optional(),
        fingerprint: Joi.string().optional(),
        status: Joi.string().valid('AVAILABLE', 'PENDING', 'SUSPEND').optional(),
        roles: Joi.string().valid('SUPER ADMIN', 'ADMIN', 'USER').optional(),
        profile: profileSchema.optional(),
      });
      return joiFilter(schema, 'body');
    }

    // Add your own custom validators here
}

export const UserValidator = new Validator();
