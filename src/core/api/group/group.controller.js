import { CreateGroupDto, GroupService, UpdateGroupDto } from 'core/modules/group';
import { ValidHttpResponse } from 'packages/handler';

class Controller {
    constructor() {
        this.service = GroupService;
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateGroupDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }

    findChildren = async req => {
        const data = await this.service.findChildren(req.params.id);
        return ValidHttpResponse.toOkResponse(data);
    }

    patchOne = async req => {
        await this.service.patchOne(req.params.id, UpdateGroupDto(req.body));
        return ValidHttpResponse.toNoContentResponse();
    }
}
export const GroupController = new Controller();
