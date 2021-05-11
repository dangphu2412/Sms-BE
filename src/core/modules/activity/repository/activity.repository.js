import { BaseRepository } from 'core/infrastructure/repository';
import { ActivityModel } from '../model/activity.model';

class Repository extends BaseRepository {
  constructor() {
    super(ActivityModel);
  }
}

export const ActivityRepository = new Repository();
