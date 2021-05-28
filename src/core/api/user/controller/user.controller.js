import SearchUserSchema from '../query/searchUser.schema.json';
import { UserService } from '../../../modules/user/service/user.service';
import { RequestTransformer } from '../../../../packages/restBuilder/core/requestTransformer';
import { Pageable, PageableMeta } from '../../../../packages/restBuilder/core/pageable';
import { CreateUserDto, UpdateProfileDto } from '../../../modules/user/dto';
import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = UserService;
    }

    findAll = async req => {
        const reqTransformed = new RequestTransformer(req.query, SearchUserSchema);
        const data = await this.service.findAll(reqTransformed.translate());
        const pagedData = Pageable.of(data[0])
            .addMeta(
                PageableMeta
                    .builder()
                    .appendRequestFormation(reqTransformed)
                    .appendTotalRecord(data[1])
                    .build()
            )
            .build();
        return ValidHttpResponse.toOkResponse(pagedData);
    }

    findTimetables = async req => {
        const data = await this.service.findTimetables(req.params.id);
        return ValidHttpResponse.toOkResponse(data);
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateUserDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }

    findOne = async req => {
        const data = await this.service.findOne(req.params);
        return ValidHttpResponse.toOkResponse(data);
    }

    patchOne = async req => {
        await this.service.patchOne(req.params, UpdateProfileDto(req.body));
        return ValidHttpResponse.toNoContentResponse();
    }

    deleteOne = async req => {
        await this.service.deleteOne(req.params);
        return ValidHttpResponse.toNoContentResponse();
    }
}

export const UserController = new Controller();
