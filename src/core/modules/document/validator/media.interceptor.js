import { ROOT_DIR } from 'core/env';
import { BaseMulterInterceptor } from '../../interceptor/document/multer.interceptor';
import { MulterUploader } from '../handler/multer.handler';

export class MediaInterceptor extends BaseMulterInterceptor {
    static #ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

    static #DEFAULT_FILE_QUANTITY = 1;

    static #DESTINATION_PATH = `${ROOT_DIR}/core/uploads/media`;

    static #KEY_NAME = 'image';

    constructor(fileQuantity = MediaInterceptor.#DEFAULT_FILE_QUANTITY) {
        super(new MulterUploader(
            MediaInterceptor.#ALLOWED_EXTENSIONS,
            MediaInterceptor.#KEY_NAME,
            fileQuantity,
            MediaInterceptor.#DESTINATION_PATH
        ));
    }
}
