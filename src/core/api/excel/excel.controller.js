import { ExcelService } from 'core/modules/document';
import { ValidHttpResponse } from 'packages/handler';

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
