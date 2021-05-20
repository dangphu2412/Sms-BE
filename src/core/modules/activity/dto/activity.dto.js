import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('Activity', {
    name: SwaggerDocument.ApiProperty({ type: 'string' }),
    isActive: SwaggerDocument.ApiProperty({ type: 'boolean' }),
});

export const CreateActivityDto = ({
    name,
    isActive,
}) => ({
    name,
    isActive,
});
