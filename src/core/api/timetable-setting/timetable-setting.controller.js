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

    findAll = async () => {
        const data = await this.service.findAll();
        return ValidHttpResponse.toOkResponse(data);
    };

    createOne = async req => {
        const data = await this.service.createOne(
            CreateTimetableSettingDto(req.body),
        );
        return ValidHttpResponse.toOkResponse(data);
    };

    updateOne = async req => {
        const data = await this.service.updateOne(
            req.params.id,
            UpdateTimetableSettingDto(req.body),
        );
        return ValidHttpResponse.toOkResponse(data);
    };
}

export const TimetableSettingController = new Controller();
