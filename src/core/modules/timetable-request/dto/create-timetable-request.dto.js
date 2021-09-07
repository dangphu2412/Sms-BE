import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetable-request.enum';
import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from '../../../../packages/swagger';

ApiDocument.addModel('tempTimetables', {
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    groupId: SwaggerDocument.ApiProperty({ type: 'string' }),
    timetableId: SwaggerDocument.ApiProperty({ type: 'string' }),
    type: SwaggerDocument.ApiProperty({ type: 'enum', model: TIMETABLE_REQUEST_TYPE }),
    registerTimeId: SwaggerDocument.ApiProperty({ type: 'string' }),
    appliedDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    customStartTime: SwaggerDocument.ApiProperty({ type: 'string' }),
    customEndTime: SwaggerDocument.ApiProperty({ type: 'string' }),
});

ApiDocument.addModel('CreateTimetableRequestDto', {
    type: SwaggerDocument.ApiProperty({ type: 'enum', model: TIMETABLE_REQUEST_TYPE }),
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    description: SwaggerDocument.ApiProperty({ type: 'string' }),
    attachment: SwaggerDocument.ApiProperty({ type: 'string' }),
    tempTimetables: SwaggerDocument.ApiProperty({ type: 'array', model: 'tempTimetables' }),
});

export const CreateTimetableRequestDto = body => ({
    userId: body.userId,
    type: body.type,
    description: body.description,
    attachment: body.attachment ?? null,
    tempTimetables: body.tempTimetables,
    isApproved: body.isApproved ?? false,
});
