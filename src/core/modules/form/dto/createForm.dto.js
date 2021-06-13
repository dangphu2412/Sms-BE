import { TIMETABLE_TYPE } from 'core/common/enum/timetable.enum';
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
    timetables: [{
        userId: body.timetables?.userId,
        groupId: body.timetables?.groupId,
        registerTime: body.timetables?.registerTime,
        type: body.timetables?.type ?? TIMETABLE_TYPE.TEMP,
        activities: body.timetables?.activities,
        startDate: body.timetables?.startDate,
        endDate: body.timetables?.endDate,
        isApproved: body.timetables?.isApproved ?? false,
        isActive: body.timetables?.isActive ?? true
    }],
    isApproved: body.isApproved ?? false,
});
