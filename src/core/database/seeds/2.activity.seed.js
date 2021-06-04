import { ActivityModel } from 'core/modules/activity/model/activity.model';
import { parallel } from 'packages/taskExecution';
import { activityDump } from '../data/init';

export class ActivitySeeder {
    static run() {
        return parallel(
            activityDump,
            item => ActivityModel.findOneAndUpdate(
                { _id: item._id }, { $set: item }, { new: true, useFindAndModify: true, upsert: true }
            )
        );
    }
}
