import pick from 'lodash/pick';
import { ForgotPasswordTemplate, MailConsumer, MailTemplateAdapter } from 'core/modules/mail';
import { NotFoundException, UnAuthorizedException } from 'packages/httpException';
import { UserRepository } from '../../user';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { JwtPayload } from '../dto';

class Service {
    constructor() {
        this.bcryptService = BcryptService;
        this.jwtService = JwtService;
        this.userRepository = UserRepository;
        this.mailConsumer = MailConsumer;
    }

    async login(loginDto) {
        const user = await this.userRepository.getAvailableByEmail(loginDto.email);
        if (user && this.bcryptService.compare(loginDto.password, user.password)) {
            return {
                user: this.#getUserInfo(user),
                accessToken: this.jwtService.sign(JwtPayload(user))
            };
        }
        throw new UnAuthorizedException('Email or password is incorrect');
    }

    async verifyAndAllowToChangePassword(email) {
        if (await this.userRepository.hasRecord('email', email)) {
            const refreshPasswordToken = this.jwtService.sign({
                email
            });
            await this.mailConsumer.add(
                MailTemplateAdapter(
                    new ForgotPasswordTemplate(email, refreshPasswordToken),
                    email
                ),
                {
                    attempts: 1
                }
            );
        } else {
            throw new NotFoundException(`This account ${email} is not existed`);
        }
    }

    async refreshPassword(refreshPasswordDto) {
        const { email } = this.jwtService.decode(refreshPasswordDto.refreshPasswordToken);
        const currentUser = await this.userRepository.getAvailableByEmail(email);

        if (currentUser) {
            if (!this.bcryptService.compare(refreshPasswordDto.oldPassword, currentUser.password)) {
                throw new UnAuthorizedException('Your current password is incorrect');
            }

            const updateDoc = {
                password: this.bcryptService.hash(refreshPasswordDto.newPassword)
            };

            if (!currentUser.isPasswordChanged) {
                updateDoc.isPasswordChanged = true;
            }

            await this.userRepository.model.updateOne({
                _id: currentUser._id
            }, updateDoc);
        }
    }

    #getUserInfo = user => pick(user, ['_id', 'email', 'profile', 'roles', 'avatar', 'status', 'isPasswordChanged']);
}

export const AuthService = new Service();
