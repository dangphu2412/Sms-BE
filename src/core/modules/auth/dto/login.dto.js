import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('LoginDto',
    {
        email: SwaggerDocument.ApiProperty({ type: 'string' }),
        password: SwaggerDocument.ApiProperty({ type: 'string' })
    });

/**
 *
 * @param body
 * @returns {{password, email}}
 * @constructor
 */
export const LoginDto = body => ({
    email: body.email,
    password: body.password
});
