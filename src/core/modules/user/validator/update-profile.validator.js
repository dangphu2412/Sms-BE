import { UniversityValidator } from './university.validator';

/** We still not have unanimity in the business
 * about updating specializedGroup of user so I commented the line below */

// import { GroupValidatorFromUserDto } from './group.validator';

class UpdateProfileImpl {
    constructor(updateProfileDto) {
        this.updateProfileDto = updateProfileDto;
    }

    async validate(updateUserDto) {
        /** so on this line */
        // await GroupValidatorFromUserDto.validate(createUserDto);

        await UniversityValidator.validate(updateUserDto);
    }
}

export const UpdateProfileValidator = new UpdateProfileImpl();
