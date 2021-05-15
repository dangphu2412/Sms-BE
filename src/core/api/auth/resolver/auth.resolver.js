import { Module } from '../../../../packages/handler/Module';
import { AuthController } from '../controller/auth.controller';
import { LoginInterceptor } from '../../../modules/auth/validator/login.interceptor';

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
            interceptors: [new LoginInterceptor()],
            controller: AuthController.login,
            body: 'LoginDto'
        },
        /**
         * This route is built for testing authorization
         * TODO: Remove in the future
         */
        {
            route: '/authorization/test',
            method: 'get',
            controller: AuthController.testAuthorization
        }
    ]);
