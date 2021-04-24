import { UserService } from '../../../modules/user/service/user.service';
import { RequestTransformer } from '../../../../packages/restBuilder/core/requestTransformer';
import SearchUserSchema from '../query/searchUser.schema.json';
import { Pageable, PageableMeta } from '../../../../packages/restBuilder/core/pageable';
import { CreateUserDto } from '../../../modules/user/dto/createUser.dto';

class Controller {
    constructor() {
        this.service = UserService;
    }

    findAll = async req => {
        const reqTransformed = new RequestTransformer(req.query, SearchUserSchema);
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

    createOne = req => this.service.createOne(CreateUserDto(req.body))

    findOne = req => this.service.findOne(req.params)

    patchOne = req => this.service.patchOne(req.params, req.body)

    deleteOne = req => this.service.deleteOne(req.params)
}

export const UserController = new Controller();
