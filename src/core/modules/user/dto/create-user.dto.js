import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger.config';

ApiDocument.addModel('Profile',
    {
        firstName: SwaggerDocument.ApiProperty({ type: 'string' }),
        lastName: SwaggerDocument.ApiProperty({ type: 'string' }),
        birthday: SwaggerDocument.ApiProperty({ type: 'string' }),
        phone: SwaggerDocument.ApiProperty({ type: 'string' }),
        hometown: SwaggerDocument.ApiProperty({ type: 'string' }),
        gender: SwaggerDocument.ApiProperty({ type: 'bool' }),
        facebook: SwaggerDocument.ApiProperty({ type: 'string' }),
        universityId: SwaggerDocument.ApiProperty({ type: 'string' })
    });

ApiDocument.addModel('Avatar',
    {
        url: SwaggerDocument.ApiProperty({ type: 'string' }),
        publicId: SwaggerDocument.ApiProperty({ type: 'string' })
    });

ApiDocument.addModel('UpsertUserDto',
    {
        email: SwaggerDocument.ApiProperty({ type: 'string' }),
        password: SwaggerDocument.ApiProperty({ type: 'string' }),
        fingerprint: SwaggerDocument.ApiProperty({ type: 'string' }),
        status: SwaggerDocument.ApiProperty({ type: 'string' }),
        avatar: SwaggerDocument.ApiProperty({ type: 'model', model: 'Avatar' }),
        profile: SwaggerDocument.ApiProperty({ type: 'model', model: 'Profile' }),
    });

export const CreateUserDto = body => ({
    email: body.email,
    password: body.password,
    fingerprint: body?.fingerprint,
    status: body?.status,
    specializedGroupId: body?.specializedGroupId,
    avatar: {
        url: body?.avatar?.url,
        publicId: body?.avatar?.publicId
    },
    profile: {
        firstName: body?.profile?.firstName,
        lastName: body?.profile?.lastName,
        birthday: body?.profile?.birthday,
        phone: body?.profile?.phone,
        hometown: body?.profile?.hometown,
        gender: body?.profile?.gender,
        facebook: body?.profile?.facebook,
        universityId: body?.profile?.universityId,
    }
});
