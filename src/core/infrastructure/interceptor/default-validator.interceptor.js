import { responseJoiError } from 'core/utils';

export class DefaultValidatorInterceptor {
    /**
      * @type {import('joi').ObjectSchema<TSchema>} schema
      */
    schema;

    /**
      * @param {import('joi').ObjectSchema<TSchema>} schema
      */
    constructor(schema) {
        this.schema = schema;
    }

    /**
     * @abstract this method has default implemetation to transfer request into
     * value to validate. If we want to change the way to validate we can override
     * this method
     */
    getData = request => {
        switch (request.method) {
        case 'POST':
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
            return request.body;
        case 'GET':
        default:
            return request.query;
        }
    };

    intercept = async (req, res, next) => {
        try {
            await this.schema.validateAsync(
                this.getData(req),
                { abortEarly: false }
            );
            return next();
        } catch (error) {
            return responseJoiError(res, error);
        }
    };
}
