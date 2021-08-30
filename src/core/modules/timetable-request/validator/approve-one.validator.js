import { ActionTimetableRequestDefaultValidator } from './action-timetable-request.default-validator';
import { ApproveConditionValidator } from './approve-condition.validator';

export class ApproveTimetableRequestValidator extends ActionTimetableRequestDefaultValidator {
    constructor(dto) {
        super(dto);
        this.approvalStatus = dto.approvalStatus;
        this.tasks.push(new ApproveConditionValidator(this.approvalStatus));
    }
}
