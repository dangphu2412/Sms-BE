import { APPROVAL_STATUS } from 'core/common/enum';
import { BadRequestException } from 'packages/httpException';

export class RejectConditionValidator {
    constructor(approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    async validate() {
        if (this.approvalStatus !== APPROVAL_STATUS.PENDING && this.approvalStatus !== APPROVAL_STATUS.APPROVED) {
            throw new BadRequestException('Can not reject with a rejected timetable request');
        }
    }
}
