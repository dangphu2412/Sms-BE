import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import { AuthService } from '../../../modules/auth/service/auth.service';
import { ForgotPassword, LoginDto } from '../../../modules/auth/dto';

class Controller {
    constructor() {
        this.service = AuthService;
    }

    login = async req => {
        const data = await this.service.login(LoginDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    }

    requestForgotPassword = async req => {
        await this.service.verifyAndAllowToChangePassword(req.body.email);
        return ValidHttpResponse.toNoContentResponse();
    }

    refreshPassword = async req => {
        await this.service.refreshPassword(ForgotPassword(req.body));
        return ValidHttpResponse.toNoContentResponse();
    }
}

export const AuthController = new Controller();
