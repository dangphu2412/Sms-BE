import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('LoginDto',
    {
        username: SwaggerDocument.ApiProperty({ type: 'string' }),
        password: SwaggerDocument.ApiProperty({ type: 'string' })
    });

export const LoginDto = body => (
    {
        email: body.email,
        password: body.password
    }
);
