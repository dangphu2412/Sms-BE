import { CreateGroupDto } from '../../../modules/group/dto/createGroup.dto';
import { GroupService } from '../../../modules/group/service/group.service';
import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = GroupService;
    }

    createOne = req => this.service.createOne(CreateGroupDto(req.body))

    findAll = async req => {
        const reqTransformed = new RequestTransformer(req.query, SearchGroupSchema);
        const data = await this.service.findAll(reqTransformed.translate());
        const count = await this.service.count();
        return Pageable.of(data)
            .addMeta(
                PageableMeta
                    .builder()
                    .appendRequestFormation(reqTransformed)
                    .appendTotalRecord(count)
                    .build()
            )
            .build();
    }
}
export const GroupController = new Controller();
