import { DataRepository } from 'packages/restBuilder/core/dataHandler';
import { ActivityModel } from './activity.model';

class Repository extends DataRepository {
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
