import { BaseRepository } from '../../../infrastructure/repository';
import { GroupModel } from '../model/groupModel';

class Repository extends BaseRepository {
    constructor() {
        super(GroupModel);
    }

    findByName(name, fields = '') {
        return this.model.findOne({ name }).select(fields);
    }

    getGeneralById(id) {
        return this.model.findById(id, '_id name')
            .populate({
                path: 'childs',
                match: { deletedAt: { $eq: null } },
                select: '_id name'
            })
            .populate({
                path: 'members',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.firstName profile.lastName avatar'
            })
            .populate({
                path: 'leader',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.firstName profile.lastName avatar'
            });
    }

    getDetailById(id) {
        return this.model.findById(id)
            .populate({
                path: 'childs',
                match: { deletedAt: { $eq: null } },
                select: '_id name members',
                populate: {
                    path: 'members',
                    match: { deletedAt: { $eq: null } },
                    select: '_id profile.firstName profile.lastName profile.phone avatar'
                }
            })
            .populate({
                path: 'leader',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.firstName profile.lastName avatar'
            });
    }
}

export const GroupRepository = new Repository();
