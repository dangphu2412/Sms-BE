import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TimetableModel } from '../model/timetable.model';

class Repository extends DataRepository {
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
        conditions = conditions?.map(item => ({
            userId: item.userId,
            'registerTime._id': item.registerTimeId
        }));
        return this.find({
            $or: conditions,
            isActive: true,
            isApproved: true,
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

    /**
     * Get current timetable of group according to setting
     * @param {Array} conditions
     * [
     *  {
     *    groupId: ObjectId,
     *    registerTimeId: ObjectId
     *  }
     * ]
     * @returns
     */
    getManyByGroupAndRegisterTime(conditions) {
        conditions = conditions?.map(item => ({
            groupId: item.groupId,
            'registerTime._id': item.registerTimeId
        }));
        return this.find({
            $or: conditions,
            isActive: true,
            isApproved: true,
        });
    }

    /**
     * Get current timetable of group
     * @param {Array} conditions
     * [
     *  {
     *    groupId: ObjectId,
     *    startDate: Date,
     *    endDate: Date
     *  }
     * ]
     * @returns
     */
    getManyByGroupsAndDateRange(conditions) {
        conditions = conditions?.map(item => ({
            groupId: item.groupId,
            startDate: {
                $gt: item.startDate
            },
            $or: [
                { endDate: { $lte: item.endDate } },
                { endDate: null }
            ]
        }));
        if (!conditions.length) return [];
        return this.find({
            $or: conditions,
            isApproved: true,
        });
    }

    getManyByGroupIds(groups, fields = []) {
        return this.model.find({
            groupId: { $in: groups }
        }).select(fields);
    }

    /**
     * Get current timetable of group
     * @param {Array} conditions
     * [
     *  {
     *    userId: ObjectId,
     *    startDate: Date,
     *    endDate: Date
     *  }
     * ]
     * @returns
     */
    getManyByUsersAndDateRange(conditions) {
        conditions = conditions?.map(item => ({
            groupId: item.userId,
            startDate: {
                $gt: item.startDate
            },
            $or: [
                { endDate: { $lte: item.endDate } },
                { endDate: null }
            ]
        }));
        if (!conditions.length) return [];
        return this.find({
            $or: conditions,
            isApproved: true,
        });
    }
}

export const TimetableRepository = new Repository();
