import { DAY_OF_WEEK } from 'core/common/enum';
import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger.config';

ApiDocument.addModel('CreateTimeTableSettingDto', {
    dayOfWeek: SwaggerDocument.ApiProperty({ type: 'enum', model: DAY_OF_WEEK }),
    name: SwaggerDocument.ApiProperty({ type: 'string' }),
    startTime: SwaggerDocument.ApiProperty({ type: 'string' }),
    endTime: SwaggerDocument.ApiProperty({ type: 'string' }),
    isActive: SwaggerDocument.ApiProperty({ type: 'bool' }),
});

export const CreateTimetableSettingDto = ({
    dayOfWeek,
    name,
    startTime,
    endTime,
    isActive,
}) => ({
    dayOfWeek,
    name,
    startTime,
    endTime,
    isActive,
});
