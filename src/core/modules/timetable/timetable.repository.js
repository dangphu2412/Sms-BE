import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { TimetableModel } from './timetable.model';

class Repository extends DataRepository {
    constructor() {
        super(TimetableModel);
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
