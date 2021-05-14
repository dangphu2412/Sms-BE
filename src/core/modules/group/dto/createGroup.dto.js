import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('CreateGroupDto',
        {
                name: SwaggerDocument.ApiProperty({ type: 'string' }),
                description: SwaggerDocument.ApiProperty({ type: 'string' }),
                childIds: SwaggerDocument.ApiProperty({ type: 'array' }),
                parentId: SwaggerDocument.ApiProperty({ type: 'string' }),
                leaderId: SwaggerDocument.ApiProperty({ type: 'string' }),
                userIds: SwaggerDocument.ApiProperty({ type: 'array' })
        });

export const CreateGroupDto = body => (
        {
                name: body.name,
                leaderId: body.leaderId,
                description: body?.description,
                childIds: body?.childIds ?? [],
                parentId: body?.parentId ?? null,
                userIds: body?.userIds ?? [],
        }
);
