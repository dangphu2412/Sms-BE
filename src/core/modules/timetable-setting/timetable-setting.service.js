import { TimetableSettingRepository } from './timetable-setting.repository';

class Service {
    constructor() {
        this.timetableSettingRepository = TimetableSettingRepository;
    }

    createOne(payload) {
        return this.timetableSettingRepository.model.create(payload);
    }

    updateOne(id, payload) {
        return this.timetableSettingRepository.updateById(id, payload);
    }
}

export const TimetableSettingService = new Service();
