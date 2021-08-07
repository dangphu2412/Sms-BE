import { CreateUserDto, UpdateProfileDto, UserService } from 'core/modules/user';
import { ChangePasswordDto } from 'core/modules/user/dto';
import { getUserContext } from 'packages/authModel/module/user';
import { RequestTransformer } from 'packages/restBuilder/core/requestTransformer';
import { ValidHttpResponse } from 'packages/handler/response';
import UserOverviewSearch from './user-overview.query.json';

class Controller {
    constructor() {
        this.service = UserService;
    }

    findAll = async req => {
        const reqTransformed = new RequestTransformer(req.query, UserOverviewSearch);
        const data = await this.service.getAndCount(reqTransformed);
        return ValidHttpResponse.toOkResponse(data);
    }

    findTimetables = async req => {
        const data = await this.service.findTimetables(req.params.id, req.query);
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

    changePassword = async req => {
        await this.service.changePassword(getUserContext(req), ChangePasswordDto(req.body));
        return ValidHttpResponse.toNoContentResponse();
    }
}

export const UserController = new Controller();