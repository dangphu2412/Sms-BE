import { TimetableSettingModel } from 'core/modules/timetable-setting';
import { parallel } from 'packages/taskExecution';
import { timetableSettingDump } from '../data/seeding/init';

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
