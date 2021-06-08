import { sample, sampleSize } from 'lodash';
import { UserRepository } from '../../modules/user/repository/user.repository';
import { GroupModel } from '../../modules/group/model/groupModel';

export class GroupSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const sampleGroupData = [];
        for (let i = 1; i <= 20; i += 1) {
            const sampleUser = sampleSize(userIds, sample([10, 12, 13, 5, 6]));
            const leader = sample(sampleUser);
            const group = {
                name: `Group LT ${i}`,
                leader: leader._id,
                description: 'this is developer group',
                members: sampleUser.map(id => id._id),
            };
            sampleGroupData.push(group);
        }
        await GroupModel.deleteMany();
        await GroupModel.insertMany(sampleGroupData);
    }
}
