import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('CreateTimetableDtos', {
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    dayOfWeek: SwaggerDocument.ApiProperty({ type: 'int' }),
    type: SwaggerDocument.ApiProperty({ type: 'string' }),
    registerTimeId: SwaggerDocument.ApiProperty({ type: 'string' }),
    activityId: SwaggerDocument.ApiProperty({ type: 'string' }),
    startDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    endDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    isActive: SwaggerDocument.ApiProperty({ type: 'bool' }),
}, true);

export const CreateTimetableDtos = body => body.map(({
    userId,
    dayOfWeek,
    type,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive
}) => ({
    userId,
    dayOfWeek,
    type,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive
}));
