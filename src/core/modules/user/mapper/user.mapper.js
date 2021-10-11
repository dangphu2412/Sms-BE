import { UserStatus } from 'core/common/enum';

export function mapToModelByUserCreationDto(userCreationDto) {
    return {
        email: userCreationDto.email,
        password: userCreationDto.password,
        fingerprint: userCreationDto.fingerprint,
        status: userCreationDto.status ?? UserStatus.PENDING,
        specializedGroup: userCreationDto.specializedGroupId,
        profile: {
            firstName: userCreationDto.profile.firstName,
            lastName: userCreationDto.profile.lastName,
            birthday: userCreationDto.profile.birthday,
            phone: userCreationDto.profile.phone,
            hometown: userCreationDto.profile.hometown,
            gender: userCreationDto.profile.gender,
            facebook: userCreationDto.profile.facebook,
            university: userCreationDto.profile.universityId
        }
    };
}

export function mapToModelByUserUpdateDto(updateProfileDto) {
    return {
        status: updateProfileDto.status,
        /**
         * We still dont agree what the business handling
         * with the `specializedGroup` so I commented this.
         */
        // specializedGroup: updateProfileDto.specializedGroupId,
        profile: {
            firstName: updateProfileDto.profile.firstName,
            lastName: updateProfileDto.profile.lastName,
            birthday: updateProfileDto.profile.birthday,
            phone: updateProfileDto.profile.phone,
            hometown: updateProfileDto.profile.hometown,
            gender: updateProfileDto.profile.gender,
            facebook: updateProfileDto.profile.facebook,
            university: updateProfileDto.profile.universityId
        }
    };
}
