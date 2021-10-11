import { UniversityRepository } from 'core/modules/university/university.repository';
import { Optional } from 'core/utils/optional.util';
import { NotFoundException } from 'packages/httpException/NotFoundException';

class UniversityValidatorImpl {
    constructor() {
        this.repository = UniversityRepository;
    }

    async validate(userDto) {
        if (userDto.profile.universityId) {
            Optional
                .of(await this.repository.findById(userDto.profile.universityId))
                .throwIfNotPresent(new NotFoundException('University not found'));
        }
    }
}

export const UniversityValidator = new UniversityValidatorImpl();
