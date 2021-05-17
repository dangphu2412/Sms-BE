import { Module } from '../../../../packages/handler/Module';
import { ExcelController } from '../controller/excel.controller';
import { MulterInterceptor } from '../../../modules/excel/validator';
import { uploadFileSwagger } from '../../../common/swagger/excel';

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
            interceptors: [new MulterInterceptor()],
            controller: ExcelController.uploadOne,
            preAuthorization: false
        }
    ]);
