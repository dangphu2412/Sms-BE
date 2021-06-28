import { hasAdminRole } from 'core/modules/auth/guard/roleDomain';
import { Module } from '../../../../packages/handler/Module';
import { ExcelController } from '../controller/excel.controller';
import { ExcelInterceptor } from '../../../modules/document/validator/excel.interceptor';
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
            interceptors: [new ExcelInterceptor(1)],
            guards: [hasAdminRole],
            controller: ExcelController.uploadOne,
            preAuthorization: true
        }
    ]);
