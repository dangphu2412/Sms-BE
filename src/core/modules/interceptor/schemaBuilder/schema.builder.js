import Joi from 'joi';

export class SchemaBuilder {
    /**
     *
     * @returns {Joi.StringSchema}
     */
    static getIdObjectBuilder() {
        return Joi
            .string()
            .regex(/^[0-9a-fA-F]{24}$/);
    }

    /**
     *
     * @returns {Joi.StringSchema}
     */
    static getOptionalStringBuilder() {
        return Joi
            .string()
            .optional();
    }
}
