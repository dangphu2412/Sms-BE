import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('UpdateProfile',
    {
        firstName: SwaggerDocument.ApiProperty({ type: 'string' }),
        lastName: SwaggerDocument.ApiProperty({ type: 'string' }),
        gender: SwaggerDocument.ApiProperty({ type: 'bool' }),
        specializedGroupId: SwaggerDocument.ApiProperty({ type: 'string' }),
        universityId: SwaggerDocument.ApiProperty({ type: 'string' }),
        birthday: SwaggerDocument.ApiProperty({ type: 'string' }),
        phone: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const UpdateProfileDto = body => ({

    firstName: body?.firstName,
    lastName: body?.lastName,
    gender: body?.gender,
    specializedGroupId: body?.specializedGroup,
    universityId: body?.universityId,
    birthday: body?.birthday,
    phone: body?.phone,

});
