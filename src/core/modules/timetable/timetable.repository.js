import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TimetableModel } from './timetable.model';

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
            user: item.userId,
            'registerTime._id': item.registerTimeId
        }));
        return this.find({
            $or: conditions,
            isActive: true,
        });
    }

    getByMemberIds(userId) {
        const selectFields = '_id name registerTime._id registerTime.name registerTime.isActive registerTime.startTime registerTime.endTime type dayOfWeek startDate endDate isActive';
        return this.model.find({ user: userId }, selectFields)
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
            group: item.groupId,
            'registerTime._id': item.registerTimeId
        }));
        return this.find({
            $or: conditions,
            isActive: true,
        });
    }

    /**
     * Get current timetable of group
     * @param {*} startDate
     * @param {*} endDate
     * @param {import('../../common/query/query.field').QueryField[]} customFields
     * @returns
     */
    searchByDateRange(startDate, endDate, ...customFields) {
        const customFilter = {};
        customFields.forEach(field => {
            Object.assign(customFilter, {
                [field.field]: {
                    [field.queryChar]: field.value
                }
            });
        });
        return this.find({
            ...customFilter,
            startDate: {
                $gt: startDate
            },
            $or: [
                { endDate: null },
                {
                    endDate: {
                        $lte: endDate
                    }
                }
            ],
        }).populate('group');
    }

    getManyByGroupIds(groups, fields = '') {
        return this.model.find({
            group: { $in: groups }
        }).select(fields);
    }
}

export const TimetableRepository = new Repository();
