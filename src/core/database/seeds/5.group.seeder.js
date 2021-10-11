import {
    keyBy, sample, sampleSize, uniq
} from 'lodash';
import { parallel } from 'packages/taskExecution';
import { UserModel } from 'core/modules/user';
import { GroupModel } from 'core/modules/group';

export class GroupSeed {
    static async run() {
        const users = await UserModel.find();
        const parentGroups = await GroupModel.find({
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
            parentGroupMap[parentGroup._id].children.push(group._id);
            memberIds.forEach(memberId => {
                parentGroupMap[parentGroup._id].members.push(memberId);
            });
        }
        await GroupModel.insertMany(sampleGroupData);
        await parallel(Object.values(parentGroupMap), group => {
            group.members = uniq(group.members);
            return group.save();
        });

        const CHUNK_PER_REQUEST = 10;
        let sizeChunk = users.length - 1;
        let chunkUpdateSpecializedGroupUsers;

        while (sizeChunk > 0) {
            chunkUpdateSpecializedGroupUsers = [];
            for (let i = sizeChunk; i > sizeChunk - CHUNK_PER_REQUEST; i -= 1) {
                if (i >= 0) {
                    const user = users[i];
                    if (!user.specializedGroup) {
                        const randomIndex = Math.ceil(Math.random() * parentGroups.length - 1);
                        chunkUpdateSpecializedGroupUsers.push(UserModel.updateOne({
                            _id: user._id,
                        }, {
                            $set: {
                                specializedGroup: parentGroups[randomIndex]._id
                            }
                        }));
                    }
                }
            }
            // eslint-disable-next-line no-await-in-loop
            await Promise.all(chunkUpdateSpecializedGroupUsers);
            chunkUpdateSpecializedGroupUsers = null;
            sizeChunk -= CHUNK_PER_REQUEST;
        }
    }
}
