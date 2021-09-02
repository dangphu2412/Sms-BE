import { CreateTimetableRequestDto, TimetableRequestService } from 'core/modules/timetable-request';
import { ValidHttpResponse } from 'packages/handler';
import { getUserContext } from 'packages/authModel/module/user/UserContext';

class Controller {
    constructor() {
        this.service = TimetableRequestService;
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateTimetableRequestDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }

    getMany = async req => {
        const data = await this.service.getMany(req.query);
        return ValidHttpResponse.toCreatedResponse(data);
    }

    approveOne = async req => {
        await this.service.approveOne(req.params.id, getUserContext(req)['payload']._id);
        return ValidHttpResponse.toNoContentResponse();
    }

    rejectOne = async req => {
        await this.service.rejectOne(req.params.id, getUserContext(req)['payload']._id);
        return ValidHttpResponse.toNoContentResponse();
    }
}

export const TimetableRequestController = new Controller();
