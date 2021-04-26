import { GroupModel } from '../../model/groupModel';
import { UserModel } from '../../../user/model/userModel';

class Query {
    async findGroupByName(groupName) {
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
    }
}
export const GroupQueryHelper = new Query();
