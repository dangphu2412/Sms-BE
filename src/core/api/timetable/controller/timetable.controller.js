import { TimetableService } from 'core/modules/timetable/service';
import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';

class Controller {
  constructor() {
    this.service = TimetableService;
  }

  createTimetable = async req => {
    const data = await this.service.createOrUpdateMany(req.body);
    return ValidHttpResponse.toCreatedResponse(data);
  };
}

export const TimetableController = new Controller();
