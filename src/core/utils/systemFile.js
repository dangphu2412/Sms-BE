import { logger } from 'core/modules/logger/winston';
import { InternalServerException } from 'packages/httpException';

const fs = require('fs');

export const deleteFile = filePath => {
    fs.unlink(filePath, err => {
        if (err) {
            logger.error(err.message);
            throw new InternalServerException(err.message);
        }
    });
};

export const toTimestamp = strDate => {
    const datum = Date.parse(strDate);
    return datum / 1000;
   };
