import { TimetableSettingModel } from 'core/modules/timetableSetting/model/timetableSetting.model';
import { parallel } from 'packages/taskExecution';
import { timetableSettingDump } from '../data/init';

export class TimetableSettingSeeder {
    static run() {
        return parallel(
            timetableSettingDump,
            item => TimetableSettingModel.findOneAndUpdate(
                { _id: item._id }, { $set: item }, { new: true, useFindAndModify: true, upsert: true }
            )
        );
    }
}
