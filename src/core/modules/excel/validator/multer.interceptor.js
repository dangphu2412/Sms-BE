import multer from 'multer';
import { uploadMulter } from '../../../config/multer';
import { logger } from '../../logger/winston';
import { InValidHttpResponse } from '../../../../packages/handler/response/invalidHttp.response';

export class MulterInterceptor {
    intercept(req, res, next) {
        const uploadHandler = uploadMulter('excel', false);

       return uploadHandler(req, res, err => {
            if (err instanceof multer.MulterError) {
                logger.error(err.message);
                 return InValidHttpResponse.toInternalResponse(err.message).toResponse(res);
              } if (err) {
                logger.error(err.message);
                 return InValidHttpResponse.toInternalResponse(err.message).toResponse(res);
              }
              return next();
        });
    }
}
