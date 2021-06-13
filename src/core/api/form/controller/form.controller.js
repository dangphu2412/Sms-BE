import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';
import { FormService } from '../../../modules/form/service/form.service';
import { CreateFormDto } from '../../../modules/form/dto';
import { GroupRepository } from '../../../modules/group/repository/group.repository';

class Controller {
    constructor() {
        this.service = FormService;
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateFormDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }

    findAll = async req => {
        // const data = await this.service.createOne(CreateFormDto(req.body));
        // return ValidHttpResponse.toCreatedResponse(data);
        console.log(req);
        const data = await GroupRepository.find();
        return ValidHttpResponse.toOkResponse(data);
    }

    findOne = async req => {
        const data = await this.service.createOne(CreateFormDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }

    patchOne = async req => {
        const data = await this.service.createOne(CreateFormDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }

    deleteOne = async req => {
        const data = await this.service.createOne(CreateFormDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }
}

export const FormController = new Controller();
