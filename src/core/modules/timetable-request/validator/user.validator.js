import { UserRepository } from 'core/modules/user';
import { mapByKey, Optional } from 'core/utils';
import { NotFoundException } from 'packages/httpException';

export class UserValidatorForTimetableRequest {
    constructor(dto) {
        this.userId = dto.userId;
        this.userIds = mapByKey(dto.tempTimetables, 'userId');
        this.repository = UserRepository;
    }

    async validate() {
        Optional
            .of(await this.repository.findById(this.userId))
            .throwIfNotPresent(new NotFoundException('User not found'));
        Optional
            .of(await this.repository.findByIds(this.userIds, ['deletedAt', 'isActive']))
            .throwIfMissingValues(this.userIds, new NotFoundException('Some users not found or have been deleted'));
    }
}
