import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TimetableRequestModel } from './timetable-request.model';

class Repository extends DataRepository {
    constructor() {
        super(TimetableRequestModel);
    }

    async findByTypeAndApprovalStatus(type, approvalStatus, queryFields) {
        const filterFields = {};

        if (type) {
            filterFields.type = type;
        }
        if (approvalStatus) {
            filterFields.approvalStatus = approvalStatus;
        }

        return this.model.find(filterFields)
            .select(['_id', 'approvalStatus', 'createdAt', ...queryFields.timetableRequest.select])
            .populate(queryFields.tempTimetable)
            .populate({
                path: 'userId',
                match: queryFields.userFilter,
                select: '_id profile.fullName'
            });
    }
}

export const TimetableRequestRepository = new Repository();
