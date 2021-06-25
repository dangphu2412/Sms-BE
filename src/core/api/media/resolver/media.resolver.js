import { Module } from '../../../../packages/handler/Module';
import { MediaController } from '../controller/media.controller';
import { MediaInterceptor } from '../../../modules/document/validator/media.interceptor';
import { uploadMediaSwagger } from '../../../common/swagger/uploadFile';
import { DeleteMediasInterceptor } from '../../../modules/document/validator/deleteFiles.interceptor';

export const MediaResolver = Module.builder()
    .addPrefix({
        prefixPath: '/media',
        tag: 'media',
        module: 'MediaModule'
    })
    .register([
        {
            route: '/images',
            method: 'post',
            params: [uploadMediaSwagger],
            consumes: ['multipart/form-data'],
            interceptors: [new MediaInterceptor(10)],
            controller: MediaController.uploadMany,
            preAuthorization: true
        },
        {
            route: '/images',
            method: 'delete',
            params: [uploadMediaSwagger],
            consumes: ['multipart/form-data'],
            interceptors: [new DeleteMediasInterceptor()],
            body: 'DeleteFileDto',
            controller: MediaController.deleteMany,
            preAuthorization: true
        },
    ]);
