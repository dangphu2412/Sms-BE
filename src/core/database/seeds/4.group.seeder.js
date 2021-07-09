import {
    keyBy, sample, sampleSize, uniq
} from 'lodash';
import { GroupRepository } from 'core/modules/group/repository/group.repository';
import { parallel } from 'packages/taskExecution';
import { UserRepository } from '../../modules/user/repository/user.repository';
import { GroupModel } from '../../modules/group/model/groupModel';

export class GroupSeed {
    static async run() {
        const users = await UserRepository.find({}, '_id');
        const parentGroups = await GroupRepository.model.find({
            parent: {
                $eq: null
            }
        });

        const parentGroupMap = keyBy(parentGroups, '_id');

        const sampleGroupData = [];
        for (let i = 1; i <= 20; i += 1) {
            const sampleUser = sampleSize(users, sample([3, 4, 5]));
            const leader = sample(sampleUser);
            const parentGroup = sample(parentGroups);
            const memberIds = sampleUser.map(id => id._id);

            const group = new GroupModel({
                name: `Group LT ${i}`,
                leader: leader._id,
                description: 'This is developer group',
                parent: parentGroup,
                members: memberIds,
            });
            sampleGroupData.push(group);
            parentGroupMap[parentGroup._id].childs.push(group._id);
            memberIds.forEach(memberId => {
                parentGroupMap[parentGroup._id].members.push(memberId);
            });
        }
        await GroupModel.insertMany(sampleGroupData);
        return parallel(Object.values(parentGroupMap), group => {
            group.members = uniq(group.members);
            return group.save();
        });
    }
}
