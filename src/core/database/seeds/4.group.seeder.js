import { UserRepository } from '../../modules/user/repository/user.repository';
import { GroupModel } from '../../modules/group/model/groupModel';

export class GroupSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const sampleGroupData = [];
        for (let i = 1; i <= 20; i += 1) {
            const group = {
                name: `Group LT ${i}`,
                leader: userIds[0]._id,
                description: 'this is developer group',
                members: userIds.map(id => id._id),
            };
            sampleGroupData.push(group);
        }
        await GroupModel.deleteMany();
        await GroupModel.insertMany(sampleGroupData);
    }
}
