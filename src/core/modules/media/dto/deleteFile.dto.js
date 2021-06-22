import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('DeleteFileDto',
    {
        fileUrls: SwaggerDocument.ApiProperty({ type: 'model', model: 'string' }),
    });

export const DeleteFileDto = body => ({
    fileIds: body.fileIds
});
