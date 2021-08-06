import { uploadFileSwagger } from 'core/common/swagger';
import { hasAdminRole } from 'core/modules/auth';
import { ExcelInterceptor } from 'core/modules/document';
import { Module } from 'packages/handler';
import { ExcelController } from './excel.controller';

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
