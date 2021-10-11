import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TimetableSettingModel } from './timetable-setting.model';

class Repository extends DataRepository {
    constructor() {
        super(TimetableSettingModel);
    }

    findActiveTimetableSettingsByIds(ids, fields = '') {
        return this.model.find({
            _id: {
                $in: ids
            },
            isActive: true
        }, fields);
    }
}

export const TimetableSettingRepository = new Repository();
