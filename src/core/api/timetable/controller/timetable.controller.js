import { CreateGroupTimetableDtos, CreateMemeberTimetablesDtos } from 'core/modules/timetable/dto';
import { TimetableService } from 'core/modules/timetable/service';
import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = TimetableService;
    }

    createMemberTimetables = async req => {
        const data = await this.service.createMemberTimetables(
            CreateMemeberTimetablesDtos(req.body),
        );
        return ValidHttpResponse.toCreatedResponse(data);
    };

    createGroupTimetable = async req => {
        const data = await this.service.createGroupTimetable(
            CreateGroupTimetableDtos(req.body),
        );
        return ValidHttpResponse.toCreatedResponse(data);
    };
}

export const TimetableController = new Controller();
