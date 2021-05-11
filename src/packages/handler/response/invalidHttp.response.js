import { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } from 'http-status';
import { HttpResponse } from './http.response';
import { ERROR_CODE } from '../../httpException/error.enum';

export class InValidHttpResponse extends HttpResponse {
    code;

    message;

    constructor(status, code, message, detail = null) {
        super(status, {
            message,
            code,
            status,
            detail
        });
    }

    static toInternalResponse(msg) {
        return new InValidHttpResponse(INTERNAL_SERVER_ERROR, ERROR_CODE.INTERNAL, msg);
    }

    static toNotFoundResponse(msg) {
        return new InValidHttpResponse(NOT_FOUND, ERROR_CODE.NOT_FOUND, msg);
    }

    static toBadRequestResponse(msg) {
        return new InValidHttpResponse(BAD_REQUEST, ERROR_CODE.BAD_REQUEST, msg);
    }
}
