import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('DeleteFileDto',
    {
        ids: SwaggerDocument.ApiProperty({ type: 'array', model: 'string' }),
    });

export const DeleteFileDto = body => ({
    ids: body.ids
});
