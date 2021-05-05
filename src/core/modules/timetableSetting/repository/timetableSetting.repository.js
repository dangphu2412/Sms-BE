import { BaseRepository } from 'core/infrastructure/repository';
import { TimetableSettingModel } from '../model/timetableSetting.model';

class Repository extends BaseRepository {
  constructor() {
    super(TimetableSettingModel);
  }
}

export const TimetableSettingRepository = new Repository();
