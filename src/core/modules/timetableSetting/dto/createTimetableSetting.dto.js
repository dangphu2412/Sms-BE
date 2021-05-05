import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('TimetableSetting', {
  alias: SwaggerDocument.ApiProperty({ type: 'string' }),
  startTime: SwaggerDocument.ApiProperty({ type: 'string' }),
  endTime: SwaggerDocument.ApiProperty({ type: 'string' }),
  status: SwaggerDocument.ApiProperty({ type: 'boolean' }),
});

export const CreateTimetableSettingDto = ({
  alias,
  startTime,
  endTime,
  status,
}) => ({
  alias,
  startTime,
  endTime,
  status,
});
