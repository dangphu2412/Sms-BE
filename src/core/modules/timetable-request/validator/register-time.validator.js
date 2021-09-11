import { mapByKeyWithObjectIdParser } from 'core/modules/mongoose/utils/array.utils';
import { TimetableSettingRepository } from 'core/modules/timetable-setting';
import { TimetableRepository } from 'core/modules/timetable/timetable.repository';
import { mapByKey, Optional } from 'core/utils';
import { BadRequestException, NotFoundException } from 'packages/httpException';

export class RegisterTimeValidatorForTimetableRequestCreation {
    constructor(dto) {
        this.dto = dto.tempTimetables;
        this.repository = TimetableSettingRepository;
        this.timetableRepository = TimetableRepository;
    }

    async validate() {
        const registerTimeIdsFromDto = mapByKeyWithObjectIdParser(this.dto, 'registerTimeId');
        const timetableIdsFromDto = mapByKeyWithObjectIdParser(this.dto, 'timetableId');

        Optional
            .of(await this.repository.findByIds(registerTimeIdsFromDto, ['deletedAt', 'isActive']))
            .throwIfMissingValues(mapByKey(this.dto, 'registerTimeId'), new NotFoundException('Some registerTimeIds is not found or have been deleted'));

        const registerTimeFromTimetableQuery = mapByKey(await this.timetableRepository.findByIds(timetableIdsFromDto, ['registerTime']), ['registerTime']);
        registerTimeFromTimetableQuery.forEach(registerTime => {
            if (registerTimeIdsFromDto.some(val => registerTime['_id'].equals(val))) {
                throw new BadRequestException('Addition date must not be as same as main timetable');
            }
        });
    }
}
