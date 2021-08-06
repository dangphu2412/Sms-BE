import { SwaggerDocument } from '../../../packages/swagger';
import { ApiDocument } from '../../config/swagger.config';

ApiDocument.addModel('CreateMemeberTimetablesDtos', {
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    type: SwaggerDocument.ApiProperty({ type: 'string' }),
    registerTimeId: SwaggerDocument.ApiProperty({ type: 'string' }),
    activityId: SwaggerDocument.ApiProperty({ type: 'string' }),
    startDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    endDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    isActive: SwaggerDocument.ApiProperty({ type: 'bool' }),
    isApproved: SwaggerDocument.ApiProperty({ type: 'bool', required: false }),
}, true);

ApiDocument.addModel('CreateGroupTimetableDtos', {
    groupId: SwaggerDocument.ApiProperty({ type: 'string' }),
    type: SwaggerDocument.ApiProperty({ type: 'string' }),
    registerTimeId: SwaggerDocument.ApiProperty({ type: 'string' }),
    activityId: SwaggerDocument.ApiProperty({ type: 'string' }),
    startDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    endDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    isActive: SwaggerDocument.ApiProperty({ type: 'bool' }),
    isApproved: SwaggerDocument.ApiProperty({ type: 'bool', required: false }),
}, true);

export const CreateMemeberTimetablesDtos = body => body.map(({
    userId,
    type,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive,
    isApproved,
}) => ({
    userId,
    type,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive,
    isApproved,
}));

export const CreateGroupTimetableDtos = body => body.map(({
    groupId,
    type,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive,
    isApproved,
}) => ({
    groupId,
    type,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive,
    isApproved,
}));
