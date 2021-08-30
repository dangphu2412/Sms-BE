import { GroupTagService } from 'core/modules/group-tag';
import { ValidHttpResponse } from 'packages/handler';
import { Pageable } from 'packages/restBuilder/core/pageable';
import { RequestTransformer } from 'packages/restBuilder/core/requestTransformer';
import GetTagsWithGroups from './query/group-overview.query.json';
import SearchGroupTags from './query/group-tag-search.query.json';

class Controller {
    constructor() {
        this.service = GroupTagService;
    }

    findAll = async req => {
        const reqTransformed = new RequestTransformer(req.query, SearchGroupTags);
        const data = await this.service.findAll(reqTransformed);
        const pagedData = Pageable.of(data).build();
        return ValidHttpResponse.toOkResponse(pagedData);
    }

    findAllWithGroups = async req => {
        const reqTransformed = new RequestTransformer(req.query, GetTagsWithGroups);
        const data = await this.service.findAllWithGroups(reqTransformed);
        const pagedData = Pageable.of(data).build();
        return ValidHttpResponse.toOkResponse(pagedData);
    }
}
export const GroupTagController = new Controller();
