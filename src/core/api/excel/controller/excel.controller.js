import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import { ExcelService } from '../../../modules/document/service/excel.service';

class Controller {
    constructor() {
        this.service = ExcelService;
    }

    uploadOne = async req => {
        const data = await this.service.uploadOne(req.file);
        return ValidHttpResponse.toOkResponse(data);
    }
}

export const ExcelController = new Controller();
