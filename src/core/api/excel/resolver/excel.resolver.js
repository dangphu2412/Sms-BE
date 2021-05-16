import { Module } from '../../../../packages/handler/Module';
import { ExcelController } from '../controller/excel.controller';
import { MulterInterceptor } from '../../../modules/excel/validator';

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
            interceptors: [new MulterInterceptor()],
            controller: ExcelController.uploadOne,
            preAuthorization: false
        }
    ]);
