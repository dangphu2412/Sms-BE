import { UserStatus } from 'core/common/enum';
import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger.config';

ApiDocument.addModel('UpdateProfileDto',
    {
        profile: SwaggerDocument.ApiProperty({ type: 'model', model: 'Profile' }),
        status: SwaggerDocument.ApiProperty({ type: 'enum', model: UserStatus }),
    });
ApiDocument.addModel('Profile', {
    firstName: SwaggerDocument.ApiProperty({ type: 'string' }),
    lastName: SwaggerDocument.ApiProperty({ type: 'string' }),
    gender: SwaggerDocument.ApiProperty({ type: 'bool' }),
    specializedGroupId: SwaggerDocument.ApiProperty({ type: 'string' }),
    universityId: SwaggerDocument.ApiProperty({ type: 'string' }),
    birthday: SwaggerDocument.ApiProperty({ type: 'string' }),
    phone: SwaggerDocument.ApiProperty({ type: 'string' }),
    hometown: SwaggerDocument.ApiProperty({ type: 'string' }),
    facebook: SwaggerDocument.ApiProperty({ type: 'string' }),
});

export const UpdateProfileDto = body => ({
    status: body.status,
    profile: {
        firstName: body.profile?.firstName,
        lastName: body.profile?.lastName,
        gender: body.profile?.gender,
        specializedGroupId: body.profile?.specializedGroup,
        universityId: body.profile?.universityId,
        birthday: body.profile?.birthday,
        phone: body.profile?.phone,
        hometown: body.profile?.hometown,
        facebook: body.profile?.facebook,
    }
});
