import { hasAdminRole } from 'core/modules/auth/guard/roleDomain';
import { Module } from '../../../../packages/handler/Module';
import { ExcelController } from '../controller/excel.controller';
import { MulterInterceptor } from '../../../modules/interceptor/multer/multer.interceptor';
import { uploadFileSwagger } from '../../../common/swagger/uploadFile';

export const ExcelResolver = Module.builder()
    .addPrefix({
        prefixPath: '/excels',
        tag: 'excels',
        module: 'ExcelModule'
    })
    .register([
        {
            route: '/users',
            method: 'post',
            params: [uploadFileSwagger],
            consumes: ['multipart/form-data'],
            interceptors: [new MulterInterceptor('excel', 1)],
            guards: [hasAdminRole],
            controller: ExcelController.uploadOne,
            preAuthorization: true
        }
    ]);
