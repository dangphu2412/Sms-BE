import '../../config/config-service.config';
import { UserModel } from 'core/modules/user';
import { GroupModel } from 'core/modules/group';
import assignSpecializedGroupData from '../data/migration/assignSpecGroup.json';

export class AssignSpecializedGroupToLeader {
    static async run() {
        const specializedGroupNames = [];

        assignSpecializedGroupData.forEach(group => {
            specializedGroupNames.push(group.specializedGroup);
        });

        const groups = await GroupModel.find({
            name: {
                $in: specializedGroupNames
            }
        });

        return Promise.all(assignSpecializedGroupData.map(data => {
            const group = groups.find(i => i.name === data.specializedGroup);
            return UserModel.updateOne({
                _id: data._id,
            }, {
                $set: {
                    specializedGroup: group
                }
            });
        }));
    }
}
