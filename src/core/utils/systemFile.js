import { logger } from 'core/modules/logger/winston';
import { InternalServerException } from 'packages/httpException';
import fs from 'fs';

export const deleteFile = filePath => {
    fs.unlink(filePath, err => {
        if (err) {
            logger.error(err.message);
            throw new InternalServerException(err.message);
        }
    });
};
