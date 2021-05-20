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
}

export const TimetableRepository = new Repository();
