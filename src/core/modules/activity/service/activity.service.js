import { ActivityRepository } from '../repository';

class Service {
    constructor() {
        this.activityRepository = ActivityRepository;
    }
}

export const ActivityService = new Service();
