import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import { TimetableRequestService } from 'core/modules/timetable_request/service/timetableRequest.service';
import { CreateTimetableRequestDto } from 'core/modules/timetable_request/dto';

class Controller {
    constructor() {
        this.service = TimetableRequestService;
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateTimetableRequestDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }
}

export const TimetableRequestController = new Controller();
