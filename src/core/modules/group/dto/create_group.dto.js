import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('createGroupDto',
    {
        name: SwaggerDocument.ApiProperty({ type: 'string' }),
        description: SwaggerDocument.ApiProperty({ type: 'string' }),
        childIds: SwaggerDocument.ApiProperty({ type: 'string' }),
        parentId: SwaggerDocument.ApiProperty({ type: 'string' }),
        userIds: SwaggerDocument.ApiProperty({ type: 'string' })
    });

export const CreateGroupDto = body => (
    {
        name: body.name,
        description: body.description,
        childIds: body.childIds || [],
        parentId: body.parentId || [],
        userIds: body.userIds || [],
    }
);
