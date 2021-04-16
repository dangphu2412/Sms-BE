import { AuthService } from '../../../modules/auth/service/auth.service';
import { LoginDto } from '../../../modules/auth/dto/index';

class Controller {
    constructor() {
        this.service = AuthService;
    }

    login = req => this.service.login(LoginDto(req.body))
}

export const AuthController = new Controller();
