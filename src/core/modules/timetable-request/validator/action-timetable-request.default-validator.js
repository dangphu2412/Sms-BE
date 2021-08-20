import { UserValidatorForTimetableRequest } from './user.validator';

export class ActionTimetableRequestDefaultValidator {
    tasks=[]

    constructor(dto) {
        this.dto = dto;
        this.tasks.push(new UserValidatorForTimetableRequest({ userId: this.dto.userId }));
    }

    async validate() {
        for (let i = 0; i < this.tasks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await this.tasks[i].validate();
        }
    }
}
