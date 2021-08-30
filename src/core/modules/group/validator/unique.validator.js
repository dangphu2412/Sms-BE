import { DuplicateException } from '../../../../packages/httpException';
import { GroupRepository } from '../group.repository';
import { Optional } from '../../../utils/optional.util';

export class UniqueGroupValidator {
    name;

    constructor(dto) {
        this.name = dto?.name;
        this.repository = GroupRepository;
    }

    async validate() {
        if (this.name) {
            Optional
                .of(await this.repository.getByName(this.name, '_id deletedAt'))
                .throwIfPresent(new DuplicateException(`Group ${this.name} is already existed`));
        }
    }
}
