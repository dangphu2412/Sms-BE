import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';
import { FormService } from '../../../modules/form/service/form.service';
import { CreateFormDto } from '../../../modules/form/dto';

class Controller {
    constructor() {
        this.service = FormService;
    }

    createOne = async req => {
        const data = await this.service.createOne(CreateFormDto(req.body));
        return ValidHttpResponse.toCreatedResponse(data);
    }
}

export const FormController = new Controller();
