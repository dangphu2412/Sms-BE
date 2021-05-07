import { AuthService } from '../../../modules/auth/service/auth.service';
import { LoginDto } from '../../../modules/auth/dto';
import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = AuthService;
    }

    login = async req => {
        const data = await this.service.login(LoginDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    }

    /**
     * This route is built for testing authorization
     * TODO: Remove in the future
     */
    // eslint-disable-next-line no-unused-vars
    testAuthorization = async req => {
        await this.service.testAuthorization();
        return ValidHttpResponse.toNoContentResponse();
    }
}

export const AuthController = new Controller();
