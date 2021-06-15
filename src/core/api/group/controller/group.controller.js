import { CreateGroupDto } from '../../../modules/group/dto/createGroup.dto';
import { GroupService } from '../../../modules/group/service/group.service';
import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';
import { RequestTransformer } from '../../../../packages/restBuilder/core/requestTransformer';
import { Pageable, PageableMeta } from '../../../../packages/restBuilder/core/pageable';
import SearchGroupSchema from '../query/searchGroup.schema.json';

class Controller {
    constructor() {
        this.service = GroupService;
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateGroupDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }

    findAll = async req => {
        const reqTransformed = new RequestTransformer(req.query, SearchGroupSchema);
        const data = await this.service.getAndCount(reqTransformed);
        const pagedData = Pageable.of(data[0])
            .addMeta(
                PageableMeta
                    .builder(reqTransformed, data[1])
                    .build()
            )
            .build();
        return ValidHttpResponse.toOkResponse(pagedData);
    }

    findOne = async req => {
        const data = await this.service.findOne(req.params.id, req.query.type);
        return ValidHttpResponse.toOkResponse(data);
    }

    deleteMember = async req => {
        await this.service.deleteMember(req.params.id, req.body.deleteIds);
        return ValidHttpResponse.toNoContentResponse();
    }
}
export const GroupController = new Controller();
