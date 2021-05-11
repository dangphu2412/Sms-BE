import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('Timetable', {
  userId: SwaggerDocument.ApiProperty({ type: 'string' }),
  dayOfWeek: SwaggerDocument.ApiProperty({ type: 'int' }),
  type: SwaggerDocument.ApiProperty({ type: 'string' }),
  registerTimeId: SwaggerDocument.ApiProperty({ type: 'string' }),
  activityId: SwaggerDocument.ApiProperty({ type: 'string' }),
  startDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
  endDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
  isActive: SwaggerDocument.ApiProperty({ type: 'boolean' }),
});

export const CreateTimetableDto = ({
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
});
