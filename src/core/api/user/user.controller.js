import { CreateUserDto, UpdateProfileDto, UserService } from 'core/modules/user';
import { ChangePasswordDto } from 'core/modules/user/dto';
import { getUserContext } from 'packages/authModel/module/user';
import { RequestTransformer } from 'packages/restBuilder/core/requestTransformer';
import { ValidHttpResponse } from 'packages/handler/response';
import { MediaService } from 'core/modules/document';
import { AVATAR_FOLDER_NAME } from 'core/common/constants/cloudinary.constant';
import UserOverviewSearch from './user-overview.query.json';

class Controller {
    constructor() {
        this.service = UserService;
        this.mediaService = MediaService;
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
        const data = await this.service.findOne(req.params.id);
        return ValidHttpResponse.toOkResponse(data);
    }

    patchOne = async req => {
        await this.service.updateOne(req.params.id, UpdateProfileDto(req.body));
        return ValidHttpResponse.toNoContentResponse();
    }

    deleteOne = async req => {
        await this.service.deleteOne(req.params.id);
        return ValidHttpResponse.toNoContentResponse();
    }

    changePassword = async req => {
        await this.service.changePassword(getUserContext(req), ChangePasswordDto(req.body));
        return ValidHttpResponse.toNoContentResponse();
    }

    uploadAvatar = async req => {
        const data = await this.mediaService.uploadOne(req.file, AVATAR_FOLDER_NAME);
        return ValidHttpResponse.toOkResponse(data);
    }

    updateAvatar = async req => {
        await this.service.updateAvatar(req.params.id, req.file, AVATAR_FOLDER_NAME);
        return ValidHttpResponse.toNoContentResponse();
    }
}

export const UserController = new Controller();
