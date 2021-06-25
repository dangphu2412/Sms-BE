import { ROOT_DIR } from 'core/env';
import { BaseMulterInterceptor } from '../../interceptor/document/multer.interceptor';
import { MulterUploader } from '../handler/multer.handler';

export class ExcelInterceptor extends BaseMulterInterceptor {
    static #ALLOWED_EXTENSIONS = ['.xlsx'];

    static #DEFAULT_FILE_QUANTITY = 1;

    static #DESTINATION_PATH = `${ROOT_DIR}/core/uploads/excel`;

    static #KEY_NAME = 'excel';

    constructor(fileQuantity = ExcelInterceptor.#DEFAULT_FILE_QUANTITY) {
        super(new MulterUploader(
            ExcelInterceptor.#ALLOWED_EXTENSIONS,
            ExcelInterceptor.#KEY_NAME,
            fileQuantity,
            ExcelInterceptor.#DESTINATION_PATH
        ));
    }
}
