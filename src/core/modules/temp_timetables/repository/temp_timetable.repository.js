import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TempTimetableModel } from '../model/tempTimetableModel';

class Repository extends DataRepository {
    constructor() {
        super(TempTimetableModel);
    }
}

export const TempTimetableRepository = new Repository();
