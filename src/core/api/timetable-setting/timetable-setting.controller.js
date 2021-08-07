import { TimetableSettingService } from 'core/modules/timetable-setting';
import {
    CreateTimetableSettingDto,
    UpdateTimetableSettingDto,
} from 'core/modules/timetable-setting/dto';
import { ValidHttpResponse } from 'packages/handler/response';

class Controller {
    constructor() {
        this.service = TimetableSettingService;
    }

    createOne = async ({ body }) => {
        const data = await this.service.createOne(
            CreateTimetableSettingDto(body),
        );
        return ValidHttpResponse.toOkResponse(data);
    };

    updateOne = async ({ params, body }) => {
        const data = await this.service.updateOne(
            params.id,
            UpdateTimetableSettingDto(body),
        );
        return ValidHttpResponse.toOkResponse(data);
    };
}

export const TimetableSettingController = new Controller();
