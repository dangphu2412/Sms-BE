import { GroupTagRepository } from 'core/modules/group-tag';
import { NotFoundException } from '../../../../packages/httpException';
import { Optional } from '../../../utils/optional.util';

export class GroupTagValidator {
    tagId;

    constructor(dto) {
        this.tagId = dto?.tagId;
        this.groupTagRepository = GroupTagRepository;
    }

    async validate() {
        if (this.tagId) {
            Optional
                .of(await this.groupTagRepository.findById(this.tagId, '_id'))
                .throwIfNullable(new NotFoundException(`Group tag: ${this.tagId} does not exist`));
        }
    }
}
