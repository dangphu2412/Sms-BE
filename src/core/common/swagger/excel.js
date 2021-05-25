import { SwaggerDocument } from '../../../packages/swagger';

export const uploadFileSwagger = SwaggerDocument.ApiParams({
    name: 'excel',
    paramsIn: 'formData',
    require: true,
    type: 'file',
    description: 'Excel file to upload',
});
