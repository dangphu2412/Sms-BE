import { BAD_REQUEST } from 'http-status';
import { InValidHttpResponse } from 'packages/handler/response/invalidHttp.response';
import { ERROR_CODE } from '../../packages/httpException/error.enum';

export const responseJoiError = (res, result) => new InValidHttpResponse(
  BAD_REQUEST,
  ERROR_CODE.BAD_REQUEST,
  'Bad request',
  result.error.details?.map(detail => ({
    type: detail.type,
    message: detail.message,
  }))
).toResponse(res);
