import { DataRepository } from 'packages/restBuilder/core/dataHandler';
import { ActivityModel } from './activity.model';

class Repository extends DataRepository {
    constructor() {
        super(ActivityModel);
    }
}

export const ActivityRepository = new Repository();
