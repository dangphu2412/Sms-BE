import { UserRepository } from 'core/modules/user/repository/user.repository';
import { Optional } from '../../../utils/optional';
import { NotFoundException } from '../../../../packages/httpException';

export class LeaderGroupValidator {
    leaderId;

    constructor(dto) {
      this.leaderId = dto.leaderId;
      this.userRepository = UserRepository;
    }

    async validate() {
      if (this.leaderId) {
        const optionalParentGroup = Optional
          .of(await this.userRepository.findById(this.leaderId, '_id deletedAt'));

        optionalParentGroup.throwIfNullable(
          new NotFoundException(`Leader with ${this.leaderId} is not exist`)
        );

        optionalParentGroup.throwIfNotPresent(
          new NotFoundException(`Leader with ${this.leaderId} has been deleted`)
        );
      }
    }
}
