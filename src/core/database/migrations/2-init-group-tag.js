import { GroupTagModel } from 'core/modules/group-tag';
import { Types } from 'mongoose';
import sgroupGroupTag from '../data/migration/initialGroupTag.json';

export class CreateInitialSgroupGroupTag {
    static run() {
        return GroupTagModel.insertMany(sgroupGroupTag
            .map(tag => new GroupTagModel(
                {
                    _id: Types.ObjectId(tag._id),
                    name: tag.name,
                    groups: []
                }
            )));
    }
}
