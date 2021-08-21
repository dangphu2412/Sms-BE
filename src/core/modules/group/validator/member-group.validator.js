import { UserStatus } from 'core/common/enum';
import { NotFoundException } from '../../../../packages/httpException';
import { UserRepository } from '../../user/user.repository';

export class MemberGroupValidator {
    memberIds;

    constructor(dto) {
        this.memberIds = dto.memberIds;
        this.userRepository = UserRepository;
    }

    async validate() {
        if (this.memberIds?.length > 0) {
            const members = await this.userRepository.findByIds(this.memberIds, '_id deletedAt');

            if (members.length > 0) {
                if (this.memberIds.length > members.length) {
                    throw new NotFoundException(`One of ${this.memberIds.toString()} member id not found`);
                }

                const deletedMemberIds = [];

                members.forEach(member => {
                    if (member.deletedAt || member.status === UserStatus.SUSPEND) {
                        deletedMemberIds.push(member.id);
                    }
                });

                if (deletedMemberIds.length > 0) {
                    throw new NotFoundException(`Members with ${deletedMemberIds.toString()} ids has been banned or suspended`);
                }
            }
        }
    }
}
