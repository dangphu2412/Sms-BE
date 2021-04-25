import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('CreateGroupDto',
    {
        name: SwaggerDocument.ApiProperty({ type: 'string' }),
        description: SwaggerDocument.ApiProperty({ type: 'string' }),
        childIds: SwaggerDocument.ApiProperty({ type: 'array' }),
        parentId: SwaggerDocument.ApiProperty({ type: 'string' }),
<<<<<<< HEAD
<<<<<<< HEAD
        leaderId: SwaggerDocument.ApiProperty({ type: 'string' }),
=======
>>>>>>> ddd7bc2 ([SMS-17]:hammer:add validator to post req create group)
=======
        leader: SwaggerDocument.ApiProperty({ type: 'string' }),
>>>>>>> ea9bb7f ([SMS-17]:sparkles: add query validator)
        userIds: SwaggerDocument.ApiProperty({ type: 'array' })
    });

export const CreateGroupDto = body => (
    {
        name: body.name,
        description: body.description,
<<<<<<< HEAD
        childIds: body.childIds ?? [],
        parentId: body.parentId ?? null,
        leaderId: body.leaderId,
        userIds: body.userIds ?? [],
=======
        childIds: body.childIds || [],
        parentId: body.parentIds || null,
        leaderId: body.leaderId || '',
        userIds: body.userIds || [],
>>>>>>> ddd7bc2 ([SMS-17]:hammer:add validator to post req create group)
    }
);
