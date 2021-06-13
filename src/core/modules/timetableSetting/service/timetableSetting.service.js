import { logger } from '../../logger/winston';
import { TimetableSettingRepository } from '../repository';

class Service {
    constructor() {
        this.timetableSettingRepository = TimetableSettingRepository;
        this.logger = logger;
    }

    createOne(payload) {
        return this.timetableSettingRepository.model.create(payload);
    }

    updateOne(id, payload) {
        return this.timetableSettingRepository.updateById(id, payload);
    }
}

export const TimetableSettingService = new Service();
