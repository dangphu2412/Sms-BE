import { ActivityRepository } from './activity.repository';

class ActivityServiceImpl {
    constructor() {
        this.repository = ActivityRepository;
    }

    findAll() {
        return this.repository.find();
    }
}

export const ActivityService = new ActivityServiceImpl();
