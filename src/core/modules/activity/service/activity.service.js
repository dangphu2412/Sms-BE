import { logger } from '../../logger/winston';
import { ActivityRepository } from '../repository';

class Service {
  constructor() {
    this.activityRepository = ActivityRepository;
    this.logger = logger;
  }
}

export const ActivityService = new Service();
