import { ROOT_DIR } from 'core/env';
import { BaseMulterInterceptor } from '../../interceptor/document/multer.interceptor';
import { MulterUploader } from '../handler/multer.handler';

export class ExcelInterceptor extends BaseMulterInterceptor {
    constructor(fileQuantity = 1) {
        super(new MulterUploader(
            '.xlsx',
            'excel',
            fileQuantity,
            `${ROOT_DIR}/core/uploads/excel`
        ));
    }
}
