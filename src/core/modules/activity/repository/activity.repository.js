import { BaseRepository } from 'core/infrastructure/repository';
import { ActivityModel } from '../model/activity.model';

class Repository extends BaseRepository {
  constructor() {
    super(ActivityModel);
  }

  findWithActiveByIds(ids, fields = '') {
    return this.model.find({
      _id: {
        $in: ids
      },
      isActive: true
    }, fields);
  }
}

export const ActivityRepository = new Repository();
