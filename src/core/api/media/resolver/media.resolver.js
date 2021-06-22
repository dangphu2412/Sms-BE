import { Module } from '../../../../packages/handler/Module';
import { MediaController } from '../controller/media.controller';
import { MulterInterceptor } from '../../../modules/interceptor/multer/multer.interceptor';
import { uploadMediaSwagger } from '../../../common/swagger/uploadFile';
import { DeleteFilesInterceptor } from '../../../modules/media/validator/deleteFiles.interceptor';

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
            interceptors: [new MulterInterceptor('image')],
            controller: MediaController.upload,
            preAuthorization: true
        },
        {
            route: '/images',
            method: 'delete',
            params: [uploadMediaSwagger],
            consumes: ['multipart/form-data'],
            interceptors: [new DeleteFilesInterceptor()],
            body: 'DeleteFileDto',
            controller: MediaController.delete,
            preAuthorization: true
        },
    ]);
