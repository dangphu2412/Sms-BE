import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TempTimetableModel } from './temp-timetable.model';

class Repository extends DataRepository {
    constructor() {
        super(TempTimetableModel);
    }
}

export const TempTimetableRepository = new Repository();
