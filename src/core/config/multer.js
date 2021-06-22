import { ROOT_DIR } from 'core/env';
import { logger } from 'core/utils';
import multer from 'multer';
import path from 'path';

class MulterHandler {
    #DESTINATION_PATH;

    #uploadConfig;

    constructor() {
        logger.info(`[${MulterHandler.name}] is building`);
        this.#DESTINATION_PATH = `${ROOT_DIR}/core/uploads`;
        this.init();
    }

    init() {
        const storage = this.getConfigedStorage();
        this.#uploadConfig = this.getConfigedUpload(storage);
    }

    getConfigedUpload(storage) {
        return multer({
            storage,
            fileFilter: (req, file, cb) => {
                const ALLOWED_EXT = ['.xlsx', '.jpg', '.jpeg', '.png'];
                if (!ALLOWED_EXT.includes(path.extname(file.originalname))) return cb(new multer.MulterError('File type not allowed'));
                return cb(null, true);
            },
        });
    }

    getConfigedStorage() {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.#DESTINATION_PATH);
            },
            filename: (req, file, cb) => {
                cb(null, this.getFileName(file));
            }
        });
    }

    getFileName(file) {
        return `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    }

    getHandler(keyName, numberOfFile = 1) {
        if (numberOfFile > 1) {
            return this.#uploadConfig.array(keyName, numberOfFile);
        }
        return this.#uploadConfig.single(keyName);
    }
}

export const multerHandler = new MulterHandler();
