import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum';
import { GroupValidatorForTimetableRequestCreation } from './group.validator';
import { RegisterTimeValidatorForTimetableRequestCreation } from './register-time.validator';
import { TimetableValidatorForTimetableRequestCreation } from './timetable.validator';
import { UserValidatorForTimetableRequest } from './user.validator';

export class TimetableRequestCreationValidator {
    tasks = [];

    constructor(dto) {
        this.dto = dto;
        this.tasks.push(new UserValidatorForTimetableRequest(this.dto));
        this.tasks.push(new TimetableValidatorForTimetableRequestCreation(this.dto));
        this.tasks.push(new GroupValidatorForTimetableRequestCreation(this.dto));
    }

    async validate() {
        if (this.dto.type === TIMETABLE_REQUEST_TYPE.ABSENT_ADD || this.dto.type === TIMETABLE_REQUEST_TYPE.ADD) {
            this.tasks.push(new RegisterTimeValidatorForTimetableRequestCreation(this.dto));
        }
        for (let i = 0; i < this.tasks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await this.tasks[i].validate();
        }
    }
}
