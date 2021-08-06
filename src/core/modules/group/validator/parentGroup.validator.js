import { NotFoundException } from '../../../../packages/httpException';
import { GroupRepository } from '../group.repository';
import { Optional } from '../../../utils/optional.util';

export class ParentGroupValidator {
    parentId;

    constructor(dto) {
        this.parentId = dto.parentId;
        this.groupRepository = GroupRepository;
    }

    async validate() {
        if (this.parentId) {
            const optionalParentGroup = Optional
                .of(await this.groupRepository.findById(this.parentId, '_id deletedAt'));

            optionalParentGroup.throwIfNullable(
                new NotFoundException(`Parent group with ${this.parentId} is not exist`)
            );

            optionalParentGroup.throwIfNotPresent(
                new NotFoundException(`Parent group with ${this.parentId} has been deleted`)
            );
        }
    }
}
