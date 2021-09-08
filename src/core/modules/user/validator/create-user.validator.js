import { UserStatus } from 'core/common/enum';
import { BadRequestException } from 'packages/httpException';
import { GroupValidatorFromUserDto } from './group.validator';
import { UniversityValidator } from './university.validator';

/**
 * @author dnphu
 */
class CreateUserValidatorImpl {
    groupRepository;

    async validate(user, createUserDto) {
        if (user?.status === UserStatus.SUSPEND) {
            throw new BadRequestException('This account is not available at the moment');
        }
        await UniversityValidator.validate(createUserDto);
        await GroupValidatorFromUserDto.validate(createUserDto);
    }
}

export const CreateUserValidator = new CreateUserValidatorImpl();
