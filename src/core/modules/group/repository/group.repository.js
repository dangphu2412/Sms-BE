import { RepositoryBase } from '../../../infrastructure/repositoryBase';
import { GroupModel } from '../model/groupModel';
import { UserModel } from '../../user/model/userModel';

class Repository extends RepositoryBase {
    constructor() {
        super(GroupModel);
    }

    findGroupByName(name) {
        return GroupModel.find({ name }).select('_id deletedAt');
    }

    findGroupById(reqGroupIds) {
        return GroupModel.find({ _id: { $in: reqGroupIds } }).select('_id deletedAt');
    }

    findUserById(reqUserIds) {
        return UserModel.find({ _id: { $in: reqUserIds } }).select('_id deletedAt');
    }
}

export const GroupRepository = new Repository();
