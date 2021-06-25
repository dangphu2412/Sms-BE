import multer from 'multer';
import { MulterUploader } from 'core/modules/document/handler/multer.handler';
import { logger } from '../../logger/winston';
import { BadRequestException, InternalServerException } from '../../../../packages/httpException';

export class BaseMulterInterceptor {
    #uploader;

    constructor(uploader) {
        if (!(uploader instanceof MulterUploader)) {
            throw new Error(` uploader must be instance of ${MulterUploader.name}`);
        }

        this.#uploader = uploader;
    }

    intercept = (req, res, next) => {
        const uploadHandler = this.#uploader.getHandler();
        return uploadHandler(req, res, err => {
            if (err instanceof multer.MulterError) {
                logger.error(err.code);
                return next(new BadRequestException(err.code));
            }
            if (err) {
                logger.error(err.message);
                return next(new InternalServerException(err.message));
            }
            return next();
        });
    }
}
