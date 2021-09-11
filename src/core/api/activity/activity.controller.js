import { ActivityService } from 'core/modules/activity/activity.service';
import { ValidHttpResponse } from 'packages/handler/response';

class Controller {
    constructor() {
        this.service = ActivityService;
    }

    // eslint-disable-next-line no-unused-vars
    findAll = async req => {
        const data = await this.service.findAll();
        return ValidHttpResponse.toOkResponse(data);
    };
}

export const ActivityController = new Controller();
