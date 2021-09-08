import { UserRepository } from 'core/modules/user/user.repository';
import { Optional } from '../../../utils/optional.util';
import { NotFoundException } from '../../../../packages/httpException';

export class LeaderGroupValidator {
    leaderId;

    constructor(dto) {
        this.leaderId = dto.leaderId;
        this.userRepository = UserRepository;
    }

    async validate() {
        if (this.leaderId) {
            const leader = Optional
                .of(await this.userRepository.findById(this.leaderId, '_id deletedAt'));

            leader.throwIfNullable(
                new NotFoundException(`Leader with ${this.leaderId} is not exist`)
            );

            leader.throwIfNotPresent(
                new NotFoundException(`Leader with ${this.leaderId} has been deleted`)
            );
        }
    }
}
