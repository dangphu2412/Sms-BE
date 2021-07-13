import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger.config';

ApiDocument.addModel('CreateGroupDto',
    {
        name: SwaggerDocument.ApiProperty({ type: 'string' }),
        description: SwaggerDocument.ApiProperty({ type: 'string' }),
        parentId: SwaggerDocument.ApiProperty({ type: 'string' }),
        leaderId: SwaggerDocument.ApiProperty({ type: 'string' }),
        memberIds: SwaggerDocument.ApiProperty({ type: 'array', model: 'int' })
    });

export const CreateGroupDto = body => (
    {
        name: body.name,
        leaderId: body.leaderId,
        description: body.description ?? '',
        parentId: body.parentId,
        memberIds: body.memberIds ?? [],
    }
);
