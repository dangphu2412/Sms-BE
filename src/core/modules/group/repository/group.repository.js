import { BaseRepository } from '../../../infrastructure/repository';
import { GroupModel } from '../model/groupModel';
import { UserModel } from '../../user/model/userModel';

class Repository extends BaseRepository {
    constructor() {
        super(GroupModel);
    }

    findGroupByName(name) {
        return this.model.find({ name }).select('_id deletedAt');
    }

    findGroupById(reqGroupIds) {
        return this.model.find({ _id: { $in: reqGroupIds } }).select('_id deletedAt');
    }

    findUserById(reqUserIds) {
        return UserModel.find({ _id: { $in: reqUserIds } }).select('_id deletedAt');
    }

    findDetailById(id) {
        return this.model.findById(id)
            .populate({
                path: 'childIds',
                match: { deletedAt: { $eq: null } },
                select: '_id name userIds',
                populate: {
                    path: 'userIds',
                    match: { deletedAt: { $eq: null } },
                    select: '_id profile.firstName profile.lastName profile.phone'
                }
            })
            .populate({
                path: 'userIds',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.firstName profile.lastName'
            })
            .populate({
                path: 'leaderId',
                match: { deletedAt: { $eq: null } },
                select: '_id profile.firstName profile.lastName'
            });
    }
}

export const GroupRepository = new Repository();
