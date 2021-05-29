import { TimetableSettingModel } from 'core/modules/timetableSetting/model/timetableSetting.model';
import { parallel } from 'packages/taskExecution';
import { timetableDump } from '../data/init';

export class TimetableSettingSeeder {
    static run() {
        return parallel(
            timetableDump,
            item => TimetableSettingModel.findOneAndUpdate(
                { _id: item._id }, { $set: item }, { upsert: true }
            )
        );
    }
}
