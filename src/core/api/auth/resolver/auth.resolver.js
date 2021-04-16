import { Module } from '../../../../packages/handler/Module';
import { AuthController } from '../controller/auth.controller';
import { UserValidator } from '../../../modules/user/validator/user.validator';

export const AuthResolver = Module.builder()
    .addPrefix({
        prefixPath: '/auth',
        tag: 'auth',
        module: 'AuthModule'
    })
    .register([
        {
            route: '/',
            method: 'post',
            middlewares: [UserValidator.validatePost()],
            controller: AuthController.login,
            body: 'LoginDto'
        }
    ]);
