import multer from 'multer';
import { multerHandler } from '../../../config/multer';
import { logger } from '../../logger/winston';
import { InValidHttpResponse } from '../../../../packages/handler/response/invalidHttp.response';

export class MulterInterceptor {
    intercept(req, res, next) {
        const uploadHandler = multerHandler.getHandler('excel', false);

        return uploadHandler(req, res, err => {
            if (err) {
                logger.error(err.message);
                return InValidHttpResponse.toInternalResponse(err.message).toResponse(res);
            }
            if (err instanceof multer.MulterError) {
                logger.error(err.message);
                return InValidHttpResponse.toInternalResponse(err.message).toResponse(res);
            }
            return next();
        });
    }
}
