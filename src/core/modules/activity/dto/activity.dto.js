import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger.config';

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
