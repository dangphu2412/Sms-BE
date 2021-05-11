import { BAD_REQUEST } from 'http-status';
import { ERROR_CODE } from 'packages/httpException/error.enum';
import { InValidHttpResponse } from 'packages/handler/response/invalidHttp.response';

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
      return new InValidHttpResponse(
        BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
        'Bad request',
        error.details?.map(detail => ({
          type: detail.type,
          message: detail.message,
        }))
      ).toResponse(res);
    }
  };

  async validation() {
    await this.schema.validateAsync(this.dataToValidate, { abortEarly: false });
  }
}
