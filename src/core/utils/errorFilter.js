import { BAD_REQUEST } from 'http-status';
import { ERROR_CODE } from '../../packages/httpException/error.enum';

export const responseJoiError = (res, result) => res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        code: ERROR_CODE.BAD_REQUEST,
        errors: result.error.details.map(detail => ({
          type: detail.type,
          message: detail.message
        }))
    });
