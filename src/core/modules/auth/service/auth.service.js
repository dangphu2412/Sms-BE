import _ from 'lodash';
import { UserRepository } from '../../user/repository/user.repository';
import { UserModel } from '../../user/model/userModel';
import { BcryptService } from './bcrypt.service';
import { JwtSingleton } from './jwt.service';
import { JwtPayload } from '../dto/index';
import { UnAuthorizedException } from '../../../../packages/httpException';

class Service {
    constructor() {
        this.bcrypt = BcryptService;
        this.jwt = JwtSingleton;
        this.userRepository = UserRepository;
    }

    async login(loginDto) {
        const user = await this.userRepository.findOne({ email: loginDto.email, deletedAt: null });
        if (user) {
            if (this.bcrypt.compare(loginDto.password, user.password)) {
                return {
                    user: _.pick(user, ['_id', 'profile', 'roles', 'email', 'status']),
                    token: this.jwt.sign(JwtPayload(user))
                };
            }
        }
        throw new UnAuthorizedException('Email or password is incorrect');
    }
}

export const AuthService = new Service();
