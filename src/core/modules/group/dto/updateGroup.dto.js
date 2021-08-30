import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger.config';

/**
 * @typedef IUpdateGroupDto
 * @property {string=} name
 * @property {string=} leaderId
 * @property {string=} tagId
 * @property {string=} description
 * @property {string=} parentId
 * @property {string[]=} memberIds
 */

ApiDocument.addModel('GroupModificationDto',
    {
        name: SwaggerDocument.ApiProperty({ type: 'string' }),
        description: SwaggerDocument.ApiProperty({ type: 'string' }),
        tagId: SwaggerDocument.ApiProperty({ type: 'string' }),
        parentId: SwaggerDocument.ApiProperty({ type: 'string' }),
        leaderId: SwaggerDocument.ApiProperty({ type: 'string' }),
        memberIds: SwaggerDocument.ApiProperty({ type: 'array', model: 'string' })
    });

export const GroupModificationDto = body => (
    {
        name: body.name,
        leaderId: body.leaderId,
        tagId: body.tagId,
        description: body.description,
        parentId: body.parentId,
        memberIds: body.memberIds,
    }
);
