import { CreateGroupTimetableDtos, CreateMemberTimetableDtos, TimetableService } from 'core/modules/timetable';
import { ValidHttpResponse } from 'packages/handler/response';

class Controller {
    constructor() {
        this.service = TimetableService;
    }

    createMemberTimetables = async req => {
        await this.service.createMemberTimetables(
            CreateMemberTimetableDtos(req.body),
        );
        return ValidHttpResponse.toNoContentResponse();
    };

    createGroupTimetable = async req => {
        await this.service.createGroupTimetable(
            CreateGroupTimetableDtos(req.body),
        );
        return ValidHttpResponse.toNoContentResponse();
    };
}

export const TimetableController = new Controller();
