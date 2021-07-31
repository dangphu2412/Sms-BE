import { ActionTimetableRequestDefaultValidator } from './action-timetable-request.default-validator';
import { RejectConditionValidator } from './reject-condition.validator';

export class RejectTimetableRequestValidator extends ActionTimetableRequestDefaultValidator {
    constructor(dto) {
        super(dto);
        this.approvalStatus = dto.approvalStatus;
        this.tasks.push(new RejectConditionValidator(this.approvalStatus));
    }
}
