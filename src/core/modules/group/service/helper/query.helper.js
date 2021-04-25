import { GroupModel } from '../../model/groupModel';
import { UserModel } from '../../../user/model/userModel';

class Query {
    async groupQueryName(groupName) {
        const group = await GroupModel.findOne({ name: groupName });
        return group;
    }

    async groupQueryId(groupId) {
        const group = await GroupModel.findById(groupId);
        return group;
    }

    async userQueryId(userId) {
        const user = await UserModel.findById(userId).select('_id');
        return user;
    }
}
export const GroupQueryHelper = new Query();
