import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { GroupModel } from './group.model';

class GroupRepositoryImpl extends DataRepository {
    constructor() {
        super(GroupModel);
    }

    getByName(name, fields = '') {
        return this.model.findOne({ name }).select(fields);
    }

    getWithChildrenById(id) {
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

    getByMemberIds(ids = []) {
        const filter = ids.length ? { members: { $in: ids } } : {};
        return this.model.find(filter)
            .select(['_id', 'name', 'description', 'registerTime'])
            .populate({
                path: 'leader',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.firstName profile.lastName avatar',
            });
    }

    isParent(id) {
        return this.hasRecord('_id', id, {
            deletedAt: {
                $eq: null
            },
            parent: {
                $eq: null
            }
        });
    }
}

export const GroupRepository = new GroupRepositoryImpl();
