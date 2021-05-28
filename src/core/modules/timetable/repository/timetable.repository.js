import { BaseRepository } from 'core/infrastructure/repository';
import { TimetableModel } from '../model/timetable.model';

class Repository extends BaseRepository {
    constructor() {
        super(TimetableModel);
    }

    /**
     * Get current timetable of users according to setting
     * @param {Array} conditions
     * [
     *  {
     *    userId: ObjectId,
     *    registerTimeId: ObjectId
     *  }
     * ]
     * @returns
     */
    getManyByUserAndRegisterTime(conditions) {
        conditions = conditions.map(item => ({
            userId: item.userId,
            'registerTime._id': item.registerTimeId
        }));
        return this.find({
            $or: conditions,
            isActive: true
        });
    }

    getByUserId(userId) {
        const selectFields = ['_id', 'name', 'registerTime._id', 'registerTime.name', 'registerTime.isActive', 'registerTime.startTime', 'registerTime.endTime', 'type', 'dayOfWeek', 'startDate', 'endDate', 'isActive', 'isApproved'];
        return this.model.find({ userId }, selectFields)
            .populate({
                path: 'activities',
                match: { deletedAt: { $eq: null } },
                select: 'name isActive'
            });
    }
}

export const TimetableRepository = new Repository();
