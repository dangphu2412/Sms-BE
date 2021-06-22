import { DeleteFileDto } from 'core/modules/media/dto/deleteFile.dto';
import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import { MediaService } from '../../../modules/media/service/media.service';

class Controller {
    constructor() {
        this.service = MediaService;
    }

    upload = async req => {
        const data = await this.service.uploadMany(req.files);
        return ValidHttpResponse.toOkResponse(data);
    }

    delete = async req => {
        const data = await this.service.deleteMany(DeleteFileDto(req.body).fileIds);
        return ValidHttpResponse.toOkResponse(data);
    }
}

export const MediaController = new Controller();
