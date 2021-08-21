import { ParentGroupValidator } from './parent-group.validator';
import { MemberGroupValidator } from './member-group.validator';
import { LeaderGroupValidator } from './leader-group.validator';
import { GroupTagValidator } from './group-tag.validator';

export class GroupCreationValidator {
    tasks = []

    constructor(dto) {
        this.tasks.push(new GroupTagValidator(dto));
        this.tasks.push(new ParentGroupValidator(dto));
        this.tasks.push(new MemberGroupValidator(dto));
        this.tasks.push(new LeaderGroupValidator(dto));
    }

    async validate() {
        for (let i = 0; i < this.tasks.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
            await this.tasks[i].validate();
        }
    }
}
