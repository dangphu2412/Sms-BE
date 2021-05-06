import { CreateTimetableSettingDto } from 'core/modules/timetableSetting/dto';
import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import { TimetableSettingService } from '../../../modules/timetableSetting/service';

class Controller {
    constructor() {
        this.service = TimetableSettingService;
    }

    createOne = async req => {
      const data = await this.service.createOne(CreateTimetableSettingDto(req.body));
      return ValidHttpResponse.toOkResponse(data);
    }
}

export const TimetableSettingController = new Controller();
