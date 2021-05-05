import { UserRepository } from '../../user/repository/user.repository';
import { BcryptService } from './bcrypt.service';
import { JwtSingleton } from './jwt.service';
import { JwtPayload } from '../dto/index';
import { UnAuthorizedException } from '../../../../packages/httpException';
import { UserDataService } from '../../user/service/userData.service';

class Service {
    constructor() {
        this.bcrypt = BcryptService;
        this.jwt = JwtSingleton;
        this.userRepository = UserRepository;
        this.userDataService = UserDataService;
    }

  /**
   *
   * @returns {Promise<{user: *, token: string}>}
   */
    async login(loginDto) {
        const user = await this.userRepository.getAvailableByEmail(loginDto.email);
        if (user && this.bcrypt.compare(loginDto.password, user.password)) {
            return {
              user: this.userDataService.getUserInfo(user),
              accessToken: this.jwt.sign(JwtPayload(user))
            };
        }
        throw new UnAuthorizedException('Email or password is incorrect');
    }
}

export const AuthService = new Service();
