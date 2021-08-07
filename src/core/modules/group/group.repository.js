import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { GroupModel } from './group.model';

class Repository extends DataRepository {
    constructor() {
        super(GroupModel);
    }

    findByName(name, fields = '') {
        return this.model.findOne({ name }).select(fields);
    }

    getChildrendById(id) {
        return this.model.findById(id).select('children')
            .populate({
                path: 'children',
                match: { deletedAt: { $eq: null } },
                select: '_id name members leader',
                populate: [{
                    path: 'members',
                    match: { deletedAt: { $eq: null } },
                    select: '_id profile.fullName profile.phone avatar'
                },
                {
                    path: 'leader',
                    match: { deletedAt: { $eq: null } },
                    select: '_id profile.fullName'
                }]
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

    isParent(id) {
        return this.repository.hasRecord('_id', id, {
            deletedAt: {
                $eq: null
            },
            parent: {
                $eq: null
            }
        });
    }
}

export const GroupRepository = new Repository();
