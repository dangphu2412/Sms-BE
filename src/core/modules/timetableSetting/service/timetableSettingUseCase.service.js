import { logger } from '../../logger/winston';
import { TimetableSettingRepository } from '../repository';

class Service {
  constructor() {
    this.timetableSettingRepository = TimetableSettingRepository;
    this.logger = logger;
  }

  createOne(payload) {
    return this.timetableSettingRepository.create(payload);
  }
}

export const TimetableSettingUseCaseService = new Service();
