import { GroupTagService } from 'core/modules/groupTag/groupTag.service';
import { Pageable } from 'packages/restBuilder/core/pageable';
import { RequestTransformer } from 'packages/restBuilder/core/requestTransformer';
import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';
import GetTagsWithGroups from '../query/getTagsWithGroups.schema.json';

class Controller {
    constructor() {
        this.service = GroupTagService;
    }

    findAllWithGroups = async req => {
        const reqTransformed = new RequestTransformer(req.query, GetTagsWithGroups);
        const data = await this.service.findAllWithGroups(reqTransformed);
        const pagedData = Pageable.of(data).build();
        return ValidHttpResponse.toOkResponse(pagedData);
    }
}
export const GroupTagController = new Controller();
