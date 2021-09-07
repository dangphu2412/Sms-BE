import { TimetableRepository } from 'core/modules/timetable/timetable.repository';
import {
    isSortedArrayEqual, mapByKey, mapParsedObjectIdToArr, Optional
} from 'core/utils';
import { BadRequestException, NotFoundException } from 'packages/httpException';

export class TimetableValidatorForTimetableRequestCreation {
    constructor(dto) {
        this.dto = dto.tempTimetables;
        this.repository = TimetableRepository;
    }

    async validate() {
        const timetableIdsFromDto = mapByKey(this.dto, 'timetableId');
        const userIdsFromDto = mapParsedObjectIdToArr(this.dto, 'userId');

        Optional
            .of(await this.repository.findByIds(timetableIdsFromDto, ['deletedAt', 'isActive']))
            .throwIfMissingValues(timetableIdsFromDto, new NotFoundException('Some timetable not found or have been deleted'));

        const userIdsFromTimetableQuery = mapParsedObjectIdToArr(await this.repository.findByIds(timetableIdsFromDto, ['user']), 'user');
        if (!isSortedArrayEqual(userIdsFromDto, userIdsFromTimetableQuery)) {
            throw new BadRequestException('Some timetable is not belong to user');
        }
    }
}
