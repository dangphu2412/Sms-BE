import { UserService } from '../../../modules/user/service/user.service';
import { RequestFormation } from '../../../../packages/restBuilder/core/requestFormation';
import SearchUserSchema from '../query/searchUser.schema.json';
import { Pageable, PageableMeta } from '../../../../packages/restBuilder/core/pageable';

class Controller {
    constructor() {
        this.service = UserService;
    }

    findAll = async req => {
        const reqFormation = new RequestFormation(req.query, SearchUserSchema);
        const data = await this.service.findAll(reqFormation.translate());
        const count = await this.service.count();
        return Pageable.of(data)
            .addMeta(
                PageableMeta
                    .builder()
                    .appendRequestFormation(reqFormation)
                    .appendTotalRecord(count)
                    .build()
            )
            .build();
    }

    createOne = req => this.service.createOne(req.body)

    findOne = req => this.service.findOne(req.params)

    patchOne = req => this.service.patchOne(req.params, req.body)

    deleteOne = req => this.service.deleteOne(req.params)
}

export const UserController = new Controller();
