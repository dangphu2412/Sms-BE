import multer from 'multer';
import { multerHandler } from '../../../config/multer';
import { logger } from '../../logger/winston';
import { InternalServerException } from '../../../../packages/httpException';

export class MulterInterceptor {
    intercept(req, res, next) {
        const uploadHandler = multerHandler.getHandler('excel', 1);
        return uploadHandler(req, res, err => {
            if (err) {
                logger.error(err.message);
                return next(new InternalServerException(err.message));
            }
            if (err instanceof multer.MulterError) {
                logger.error(err.message);
                return next(new InternalServerException(err.message));
            }
            return next();
        });
    }
}
