import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetableRequest.enum';
import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('tempTimetables', {
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    groupId: SwaggerDocument.ApiProperty({ type: 'string' }),
    timetableId: SwaggerDocument.ApiProperty({ type: 'string' }),
    type: SwaggerDocument.ApiProperty({ type: 'enum', model: TIMETABLE_REQUEST_TYPE }),
    registerTime: SwaggerDocument.ApiProperty({ type: 'string' }),
    appliedDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    customStartTime: SwaggerDocument.ApiProperty({ type: 'string' }),
    customEndTime: SwaggerDocument.ApiProperty({ type: 'string' }),
});

ApiDocument.addModel('CreateTimetableRequestDto', {
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    type: SwaggerDocument.ApiProperty({ type: 'enum', model: TIMETABLE_REQUEST_TYPE }),
    description: SwaggerDocument.ApiProperty({ type: 'string' }),
    attachment: SwaggerDocument.ApiProperty({ type: 'string' }),
    tempTimetables: SwaggerDocument.ApiProperty({ type: 'array', model: 'tempTimetables' }),
    isApproved: SwaggerDocument.ApiProperty({ type: 'bool' }),
});

export const CreateTimetableRequestDto = body => ({
    userId: body.userId,
    type: body.type,
    description: body.description,
    attachment: body.attachment ?? null,
    tempTimetables: [...body.tempTimetables],
    isApproved: body.isApproved ?? false,
});
