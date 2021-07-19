import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TimetableRequestModel } from '../model/timetableRequestModel';

class Repository extends DataRepository {
    constructor() {
        super(TimetableRequestModel);
    }

    async findByType(queryFields, type, status) {
        return this.model.find({ type, status })
            .select(['_id', 'status', 'createdAt', ...queryFields.timetableRequest.select])
            .populate(queryFields.tempTimetable)
            .populate({
                path: 'userId',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.fullName'
            });
    }
}

export const TimetableRequestRepository = new Repository();
