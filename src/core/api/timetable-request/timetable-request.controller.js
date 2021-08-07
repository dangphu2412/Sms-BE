import { CreateTimetableRequestDto, TimetableRequestService } from 'core/modules/timetable-request';
import { ValidHttpResponse } from 'packages/handler';

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
}

export const TimetableRequestController = new Controller();
