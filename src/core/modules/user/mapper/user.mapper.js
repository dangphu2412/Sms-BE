export function mapToModelByUserCreationDto(userCreationDto) {
    userCreationDto.specializedGroup = userCreationDto.specializedGroupId;
    userCreationDto.profile.university = userCreationDto.profile.universityId;
    delete userCreationDto.profile.universityId;
    delete userCreationDto.specializedGroupId;

    return userCreationDto;
}

export function mapToModelByUserUpdateDto(updateProfileDto) {
    if (updateProfileDto.specializedGroupId) {
        updateProfileDto.specializedGroup = updateProfileDto.specializedGroupId;
        delete updateProfileDto.specializedGroupId;
    }
    if (updateProfileDto.profile.universityId) {
        updateProfileDto.profile.university = updateProfileDto.profile.universityId;
        delete updateProfileDto.profile.universityId;
    }
    return updateProfileDto;
}
