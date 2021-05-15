import { authorization } from 'core/config/authorization';
import { UserRepository } from '../../user/repository/user.repository';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { JwtPayload } from '../dto/index';
import { UnAuthorizedException } from '../../../../packages/httpException';
import { UserDataService } from '../../user/service/userData.service';
import '../def';

class Service {
    constructor() {
        this.bcrypt = BcryptService;
        this.jwtService = JwtService;
        this.userRepository = UserRepository;
        this.userDataService = UserDataService;
    }

  /**
   *
   * @param {LoginDtoDef} loginDto
   * @returns {Promise<LoginResponseDef>}
   */
    async login(loginDto) {
        const user = await this.userRepository.getAvailableByEmail(loginDto.email);
        if (user && this.bcrypt.compare(loginDto.password, user.password)) {
            return {
              user: this.userDataService.getUserInfo(user),
              accessToken: this.jwtService.sign(JwtPayload(user))
            };
        }
        throw new UnAuthorizedException('Email or password is incorrect');
    }

    async testAuthorization() {
        const validator = authorization
            .buildValidator();

            await validator
                .addParams({
                    authContext: 'authContext',
                    something: 2
                })
                .addRules('TEST_AUTHORIZATION')
                .validate();

        /**
         * This method can retrieve local variable from
         * authorization store
         */
        // eslint-disable-next-line no-unused-vars
        const local = validator.getFromStore('local');
    }
}

export const AuthService = new Service();
