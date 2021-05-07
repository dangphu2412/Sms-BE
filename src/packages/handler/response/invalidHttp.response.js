import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { HttpResponse } from './http.response';
import { ERROR_CODE } from '../../httpException/error.enum';

export class InValidHttpResponse extends HttpResponse {
    code;

    message;

    constructor(status, code, message) {
        super(status, {
            message,
            code,
            status
        });
    }

    static toInternalResponse(msg) {
        return new InValidHttpResponse(INTERNAL_SERVER_ERROR, ERROR_CODE.INTERNAL, msg);
    }

    static toNotFoundResponse(msg) {
        return new InValidHttpResponse(NOT_FOUND, ERROR_CODE.NOT_FOUND, msg);
    }
}
