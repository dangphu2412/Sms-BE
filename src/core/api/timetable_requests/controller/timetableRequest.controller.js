import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import { TimetableRequestService } from 'core/modules/timetable_request/service/timetableRequest.service';
import { CreateTimetableRequestDto, ActionTimetableRequestDto } from 'core/modules/timetable_request/dto';

class Controller {
    constructor() {
        this.service = TimetableRequestService;
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateTimetableRequestDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }

    getByType = async req => {
        const data = await this.service.getByType(req.query.type, req.query.status);
        return ValidHttpResponse.toCreatedResponse(data);
    }

    actionOne = async req => {
        const data = await this.service.actionOne(req.params.id, ActionTimetableRequestDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }
}

export const TimetableRequestController = new Controller();
