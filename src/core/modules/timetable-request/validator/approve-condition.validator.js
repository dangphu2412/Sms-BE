import { APPROVAL_STATUS } from 'core/common/enum';
import { BadRequestException } from 'packages/httpException';

export class ApproveConditionValidator {
    constructor(approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    async validate() {
        if (this.approvalStatus !== APPROVAL_STATUS.PENDING) {
            throw new BadRequestException('Can not approve with an approved/rejected timetable request');
        }
    }
}
