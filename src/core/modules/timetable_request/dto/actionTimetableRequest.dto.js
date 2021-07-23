import { APPROVAL_STATUS } from 'core/common/enum';
import { SwaggerDocument } from 'packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('actionTimetableRequestDto', {
    approvalStatus: SwaggerDocument.ApiProperty({ type: 'enum', model: APPROVAL_STATUS })
});

export const ActionTimetableRequestDto = body => ({
    approvalStatus: body.approvalStatus
});
