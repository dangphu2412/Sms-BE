import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('TimetableSetting', {
  name: SwaggerDocument.ApiProperty({ type: 'string' }),
  startTime: SwaggerDocument.ApiProperty({ type: 'string' }),
  endTime: SwaggerDocument.ApiProperty({ type: 'string' }),
  isActive: SwaggerDocument.ApiProperty({ type: 'boolean' }),
});

export const CreateTimetableSettingDto = ({
  name,
  startTime,
  endTime,
  isActive,
}) => ({
  name,
  startTime,
  endTime,
  isActive,
});
