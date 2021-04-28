import { AuthService } from '../../../modules/auth/service/auth.service';
import { LoginDto } from '../../../modules/auth/dto/index';
import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = AuthService;
    }

    login = async req => {
        const data = await this.service.login(LoginDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    }
}

export const AuthController = new Controller();
