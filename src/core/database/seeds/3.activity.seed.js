import { ActivityModel } from 'core/modules/activity';
import { activityDump } from '../data/seeding/init';

export class ActivitySeeder {
    static run() {
        return ActivityModel.insertMany(activityDump);
    }
}
