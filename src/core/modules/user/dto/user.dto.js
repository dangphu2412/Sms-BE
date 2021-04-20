import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('profile',
{
    firstName: SwaggerDocument.ApiProperty({ type: 'String' }),
    lastName: SwaggerDocument.ApiProperty({ type: 'String' }),
    birthday: SwaggerDocument.ApiProperty({ type: 'String' }),
    phone: SwaggerDocument.ApiProperty({ type: 'String' }),
    hometown: SwaggerDocument.ApiProperty({ type: 'String' }),
    gender: SwaggerDocument.ApiProperty({ type: 'Boolean' }),
    facebook: SwaggerDocument.ApiProperty({ type: 'String' }),
    universityId: SwaggerDocument.ApiProperty({ type: 'String' })
});

ApiDocument.addModel('CreateDto',
{
    email: SwaggerDocument.ApiProperty({ type: 'String' }),
    password: SwaggerDocument.ApiProperty({ type: 'String' }),
    fingerprint: SwaggerDocument.ApiProperty({ type: 'String' }),
    status: SwaggerDocument.ApiProperty({ type: 'String' }),
    profile: SwaggerDocument.ApiProperty({ model: 'profile' }),
});

export const CreateDto = body => ({
    email: body.email,
    password: body.password,
    fingerprint: body.fingerprint,
    status: body.status,
    profile: {
        firstName: body.profile.firstName,
        lastName: body.profile.lastName,
        birthday: body.profile.birthday,
        phone: body.profile.phone,
        hometown: body.profile.hometown,
        gender: body.profile.gender,
        facebook: body.profile.facebook,
        universityId: body.profile.universityId,
    }
});
