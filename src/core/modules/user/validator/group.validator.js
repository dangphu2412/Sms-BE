import { GroupRepository } from 'core/modules/group/group.repository';
import { UnprocessableEntityException } from 'packages/httpException/UnprocessableEntityException';

class GroupValidatorImpl {
    constructor() {
        this.repository = GroupRepository;
    }

    async validate(userDto) {
        if (userDto.specializedGroupId && !await this.repository.isParent(userDto.specializedGroupId)) {
            throw new UnprocessableEntityException(
                'Group relate to specializedGroupId is not existing or not a parent group'
            );
        }
    }
}

export const GroupValidatorFromUserDto = new GroupValidatorImpl();
