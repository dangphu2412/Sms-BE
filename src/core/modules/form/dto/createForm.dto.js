import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('Timetable', {
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    groupId: SwaggerDocument.ApiProperty({ type: 'string' }),
    registerTime: SwaggerDocument.ApiProperty({ type: 'string' }),
    type: SwaggerDocument.ApiProperty({ type: 'string' }),
    activities: SwaggerDocument.ApiProperty({ type: 'array', model: 'string' }),
    startDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    endDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    isApproved: SwaggerDocument.ApiProperty({ type: 'bool', example: false }),
    isActive: SwaggerDocument.ApiProperty({ type: 'bool' }),
});

ApiDocument.addModel('CreateFormDto', {
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    reason: SwaggerDocument.ApiProperty({ type: 'string' }),
    type: SwaggerDocument.ApiProperty({ type: 'string' }),
    attachment: SwaggerDocument.ApiProperty({ type: 'string' }),
    isApproved: SwaggerDocument.ApiProperty({ type: 'bool' }),
    timetables: SwaggerDocument.ApiProperty({ type: 'model', model: 'Timetable' }),
});

export const CreateFormDto = body => ({
    userId: body.userId,
    reason: body.reason,
    type: body.type,
    attachment: body.attachment,
    timetables: [...body.timetables],
    isApproved: body.isApproved ?? false,
});
