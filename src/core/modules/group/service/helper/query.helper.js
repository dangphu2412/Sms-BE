import { GroupModel } from '../../model/groupModel';
import { UserModel } from '../../../user/model/userModel';

class Query {
    async findGroupByName(groupName) {
<<<<<<< HEAD
        const groupByName = await GroupModel.find({ name: groupName }).select('_id deletedAt');
        return groupByName;
    }

    async findGroupById(reqGroupIds) {
        const groupsById = await GroupModel.find({ _id: { $in: reqGroupIds } }).select('_id deletedAt');
        return groupsById;
    }

    async findUserById(reqUserIds) {
        const usersById = await UserModel.find({ _id: { $in: reqUserIds } }).select('_id deletedAt');
        return usersById;
=======
        const group = await GroupModel.findOne({ name: groupName });
        return group;
    }

    async findGroupById(groupId) {
        const group = await GroupModel.findById(groupId);
        return group;
    }

    async findUserById(userId) {
        const user = await UserModel.findById(userId).select('_id');
        return user;
>>>>>>> 6ff6bd0 ([SMS-17]:hammer: renaming the query helper, add more validate option)
    }
}
export const GroupQueryHelper = new Query();
