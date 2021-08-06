import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

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
