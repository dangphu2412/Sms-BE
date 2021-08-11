import { responseJoiError } from 'core/utils';

export class BaseValidateInterceptor {
    /**
     * @type {import('joi').ObjectSchema<TSchema>} schema
     */
    schema;

    /**
     * @type {object}
     */
    dataToValidate;

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

    getSchema = () => {
        throw new Error('Method not implemented.');
    };

    intercept = async (req, res, next) => {
        try {
            this.schema = this.getSchema();
            this.dataToValidate = this.getData(req);
            await this.validation();
            return next();
        } catch (error) {
            return responseJoiError(res, error);
        }
    };

    async validation() {
        await this.schema.validateAsync(this.dataToValidate, { abortEarly: false });
    }
}
