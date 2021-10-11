import { GroupRepository } from 'core/modules/group';
import { mapByKeyWithObjectIdParser } from 'core/modules/mongoose/utils/array.utils';
import { UserRepository } from 'core/modules/user';
import {
    isSortedArrayEqual, mapByKey, Optional
} from 'core/utils';
import { BadRequestException, NotFoundException } from 'packages/httpException';

export class GroupValidatorForTimetableRequestCreation {
    constructor(dto) {
        this.dto = dto.tempTimetables;
        this.repository = GroupRepository;
        this.userRepository = UserRepository;
    }

    async validate() {
        const userIdsWithGroupIdsFromDto = [];
        this.dto.forEach(tempTimetable => {
            if (tempTimetable.groupId) {
                userIdsWithGroupIdsFromDto.push({
                    userId: tempTimetable.userId,
                    groupId: tempTimetable.groupId
                });
            }
        });
        if (userIdsWithGroupIdsFromDto.length > 0) {
            const groupIdsFromDto = mapByKeyWithObjectIdParser(userIdsWithGroupIdsFromDto, 'groupId');

            Optional
                .of(await this.repository.findByIds(groupIdsFromDto, ['deletedAt', 'isActive']))
                .throwIfMissingValues(mapByKey(userIdsWithGroupIdsFromDto, 'groupId'), new NotFoundException('Some groups not found or have been deleted'));

            const groupIdsFromUserQuery = mapByKey(await this.userRepository.findByIds(mapByKey(userIdsWithGroupIdsFromDto, 'userId'), ['specializedGroup']), 'specializedGroup');
            if (!isSortedArrayEqual(groupIdsFromDto, groupIdsFromUserQuery)) {
                throw new BadRequestException('Some users is not belong to groups');
            }
        }
    }
}
