import { SwaggerDocument } from '../../../packages/swagger';

export const uploadFileSwagger = SwaggerDocument.ApiParams({
    name: 'excel',
    paramsIn: 'formData',
    require: true,
    type: 'file',
    description: 'Excel file to upload',
});

export const uploadMediaSwagger = SwaggerDocument.ApiParams({
    name: 'image',
    paramsIn: 'formData',
    require: true,
    type: 'file',
    description: 'Image file to upload',
});
