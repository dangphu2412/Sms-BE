import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('ChangePasswordDto',
    {
        oldPassword: SwaggerDocument.ApiProperty({ type: 'string' }),
        newPassword: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const ChangePasswordDto = body => ({
    oldPassword: body.oldPassword,
    newPassword: body.newPassword
});
