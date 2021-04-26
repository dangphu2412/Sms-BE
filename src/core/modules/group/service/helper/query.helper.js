import { GroupModel } from '../../model/groupModel';
import { UserModel } from '../../../user/model/userModel';

class Query {
    async findGroupByName(groupName) {
        const NumberofGroup = await GroupModel.find({ name: groupName }).select('_id deletedAt');
        return NumberofGroup;
    }

    async findGroupById(reqGroupIds) {
        const groups = await GroupModel.find({ _id: { $in: reqGroupIds } }).select('_id deletedAt');
        return groups;
    }

    async countUserById(reqUserIds) {
        const numberOfUser = await UserModel.countDocuments({ _id: { $in: reqUserIds } });
        return numberOfUser;
    }
}
export const GroupQueryHelper = new Query();
