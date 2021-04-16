import { UserModel } from '../../user/model/userModel';
import { BcryptService } from '../bcrypt';
import { JwtSingleton } from '../jwt';
import { JwtPayload } from '../dto/index';
import { UnAuthorizedException } from '../../../../packages/httpException';

class Service {
    constructor() {
        this.bcrypt = BcryptService;
        this.jwt = JwtSingleton;
    }

    async login(loginDto) {
        const userData = await UserModel.findOne({ email: loginDto.email });
        if (!userData) {
            throw new UnAuthorizedException('Username or password is incorrect');
        }
        const isInvalidPassword = !this.bcrypt.compare(loginDto.password, userData.password);
        if (isInvalidPassword) {
            throw new UnAuthorizedException('Username or password is incorrect');
        }
        return this.jwt.sign(JwtPayload(userData));
    }
}

export const AuthService = new Service();
