import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { GroupModel } from '../model/groupModel';

class Repository extends DataRepository {
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

    getByUserId(id) {
        return this.model.find({ members: id })
            .select(['_id', 'name', 'description', 'registerTime'])
            .populate({
                path: 'leader',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.firstName profile.lastName avatar',
            });
    }

    deleteMember(groupId, memberIds) {
        return this.model.updateMany({ _id: groupId }, { $pullAll: { members: memberIds } });
    }
}

export const GroupRepository = new Repository();
