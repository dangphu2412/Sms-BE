import { SwaggerDocument } from '../../../../packages/swagger';
import { ApiDocument } from '../../../config/swagger';

ApiDocument.addModel('UpdateTimetableSettingDto', {
    isActive: SwaggerDocument.ApiProperty({ type: 'bool' }),
});

export const UpdateTimetableSettingDto = ({
    isActive,
}) => ({
    isActive,
});
