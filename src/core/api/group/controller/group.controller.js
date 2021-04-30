import { CreateGroupDto } from '../../../modules/group/dto/createGroup.dto';
import { GroupService } from '../../../modules/group/service/group.service';
import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = GroupService;
    }

    createOne = req => this.service.createOne(CreateGroupDto(req.body))

    // findAll = async req => {
    //     const reqTransformed = new RequestTransformer(req.query, SearchGroupSchema);
    // }
}
export const GroupController = new Controller();
