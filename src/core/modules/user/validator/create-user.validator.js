import { UserStatus } from 'core/common/enum';
import { GroupRepository } from 'core/modules/group';
import { BadRequestException, UnprocessableEntityExeception } from 'packages/httpException';

/**
 * @author dnphu
 */
class CreateUserValidatorImpl {
    groupRepository;

    constructor() {
        this.groupRepository = GroupRepository;
    }

    async validate(user, createUserDto) {
        if (user?.status === UserStatus.SUSPEND) {
            throw new BadRequestException('This account is not available at the moment');
        }

        if (await this.groupRepository.isParent(createUserDto.specilizedGroupId)) {
            throw new UnprocessableEntityExeception(
                'Group relate to specializedGroupId is not existing or not a parent group'
            );
        }

        createUserDto.specilizedGroup = createUserDto.specilizedGroupId;
        delete createUserDto.specilizedGroupId;
    }
}

export const CreateUserValidator = new CreateUserValidatorImpl();
