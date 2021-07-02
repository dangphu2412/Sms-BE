import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TimetableRequestModel } from '../model/timetableRequesModel';

class Repository extends DataRepository {
    constructor() {
        super(TimetableRequestModel);
    }
}

export const TimetableRequestRepository = new Repository();
