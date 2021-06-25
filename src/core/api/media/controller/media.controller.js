import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import { DeleteFileDto } from '../../../modules/document/dto/deleteFile.dto';
import { MediaService } from '../../../modules/document/service/media.service';

class Controller {
    constructor() {
        this.service = MediaService;
    }

    uploadMany = async req => {
        const data = await this.service.uploadMany(req.files, 'avatar');
        return ValidHttpResponse.toOkResponse(data);
    }

    deleteMany = async req => {
        const data = await this.service.deleteMany(DeleteFileDto(req.body).ids);
        return ValidHttpResponse.toOkResponse(data);
    }
}

export const MediaController = new Controller();