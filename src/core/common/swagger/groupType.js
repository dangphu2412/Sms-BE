import { SwaggerDocument } from '../../../packages/swagger';
import { GroupFetchCase } from '../enum/groupFetchCase';

export const GroupType = SwaggerDocument.ApiParams({
    name: 'type',
    paramsIn: 'query',
    type: 'enum',
    description: 'Type to retrieving data',
    model: GroupFetchCase
});
