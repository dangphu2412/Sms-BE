import { Optional } from 'core/utils';
import { NotFoundException } from 'packages/httpException';
import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler';
import { TimetableSettingRepository } from './timetable-setting.repository';

class TimetableSettingServiceImpl extends DataPersistenceService {
    constructor() {
        super(TimetableSettingRepository);
    }

    findAll() {
        return this.timetableSettingRepository.find();
    }

    createOne(payload) {
        return this.timetableSettingRepository.model.create(payload);
    }

    async updateOne(id, payload) {
        const timetableSetting = Optional
            .of(await this.repository.findById(id))
            .throwIfNullable(new NotFoundException(`Can not find timetable setting with id ${id}`))
            .throwIfNotPresent(new NotFoundException(`Timetable setting with id ${id} has been deleted`))
            .get();
        await super.patchOne(id, timetableSetting, payload);
    }
}

export const TimetableSettingService = new TimetableSettingServiceImpl();
