import { ROOT_DIR } from 'core/env';
import { BaseMulterInterceptor } from '../../interceptor/document/multer.interceptor';
import { MulterUploader } from '../handler/multer.handler';

export class MediaInterceptor extends BaseMulterInterceptor {
    constructor(fileQuantity = 1) {
        super(new MulterUploader(
            ['.png', '.jpg', '.jpeg'],
            'image',
            fileQuantity,
            `${ROOT_DIR}/core/uploads/media`
        ));
    }
}
