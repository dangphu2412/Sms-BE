import { GroupModel } from 'core/modules/group';
import { GroupTagRepository } from 'core/modules/group-tag';
import { UserRepository } from 'core/modules/user';
import { keyBy } from 'lodash';
import { parallel } from 'packages/taskExecution';
import sgroupGroup from '../data/migration/initialGroup.json';

export class CreateInitialSgroupGroup {
    static async run() {
        const fullNameOfLeaders = [];
        const groupTagsOfSgroup = [];
        sgroupGroup.forEach(group => {
            fullNameOfLeaders.push(group.leader);
            groupTagsOfSgroup.push(group.groupTag);
        });

        // Get all leaders by profile.fullName
        let leaders = await UserRepository.model.find({
            'profile.fullName': {
                $in: fullNameOfLeaders
            }
        });
        let groupTags = await GroupTagRepository.model.find({
            name: {
                $in: groupTagsOfSgroup
            }
        });

        const leaderMap = {};

        leaders.forEach(leader => {
            leaderMap[leader.profile.fullName] = leader;
        });

        const groupTagMap = keyBy(groupTags, 'name');

        leaders = undefined;
        groupTags = undefined;

        const docs = sgroupGroup.map(group => {
            const doc = new GroupModel({
                ...group,
                parent: null,
                groupTag: groupTagMap[group.groupTag],
                leader: leaderMap[group.leader]
            });

            groupTagMap[group.groupTag].groups.push(doc._id);

            return doc;
        });

        await parallel(Object.values(groupTagMap), groupTag => groupTag.save());

        return GroupModel.create(docs);
    }
}
