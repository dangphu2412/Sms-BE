import Joi from 'joi';

export class SchemaValidation {
  static strPhoneNumber = () => Joi.string().regex(/^[0-9+ ]{10,11}$/);

  static strEmail = () => Joi.string().email();

  static strDate = () => Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/);

  static objectId = () => Joi.string().regex(/^[0-9a-fA-F]{24}$/)
}
