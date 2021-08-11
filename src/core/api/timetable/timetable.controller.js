import { CreateGroupTimetableDtos, CreateMemberTimetableDtos, TimetableService } from 'core/modules/timetable';
import { ValidHttpResponse } from 'packages/handler/response';

class Controller {
    constructor() {
        this.service = TimetableService;
    }

    createMemberTimetables = async req => {
        const data = await this.service.createMemberTimetables(
            CreateMemberTimetableDtos(req.body),
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
