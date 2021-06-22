import multer from 'multer';
import { multerHandler } from '../../../config/multer';
import { logger } from '../../logger/winston';
import { BadRequestException, InternalServerException } from '../../../../packages/httpException';

export class MulterInterceptor {
    MAX_FILE = 10;

    fileType;

    fileQuantity;

    constructor(fileType = null, fileQuantity = null) {
        if (!fileType) {
            throw new Error('FileType is required when constructoring');
        }

        if (!fileQuantity) {
            this.fileQuantity = this.MAX_FILE;
        }

        this.fileType = fileType;
    }

    intercept = (req, res, next) => {
        const uploadHandler = multerHandler.getHandler(this.fileType, this.fileQuantity);
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
