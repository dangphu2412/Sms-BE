import { SwaggerDocument } from '../../../packages/swagger';

export const ObjectId = SwaggerDocument.ApiParams({
    name: 'id',
    paramsIn: 'path',
    type: 'string',
    description: 'ObjectId to find',
});
