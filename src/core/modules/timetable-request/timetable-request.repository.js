import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TimetableRequestModel } from './timetable-request.model';

class Repository extends DataRepository {
    constructor() {
        super(TimetableRequestModel);
    }

    async findByType(queryFields, type, approvalStatus) {
        const filterObj = {
        };
        if (type) {
            filterObj.type = type;
        }
        if (approvalStatus) {
            filterObj.approvalStatus = approvalStatus;
        }

        return this.model.find(filterObj)
            .select(['_id', 'approvalStatus', 'createdAt', ...queryFields.timetableRequest.select])
            .populate(queryFields.tempTimetable)
            .populate({
                path: 'userId',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.fullName'
            });
    }
}

export const TimetableRequestRepository = new Repository();
