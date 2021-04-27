import { BAD_REQUEST } from 'http-status';
import { ERROR_CODE } from '../../packages/httpException/error.enum';

export const responseJoiError = (res, result) => res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        code: ERROR_CODE.BAD_REQUEST,
        message: result.error.details.map(detail => detail.message)
    });
