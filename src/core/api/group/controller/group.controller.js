import { CreateGroupDto } from '../../../modules/group/dto/createGroup.dto';
import { GroupService } from '../../../modules/group/service/group.service';
import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = GroupService;
    }

    createOne = req => this.service.createOne(CreateGroupDto(req.body));
}
export const GroupController = new Controller();
