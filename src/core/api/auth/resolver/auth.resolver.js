import { forgotPasswordInterceptor } from 'core/modules/auth/validator/forgot-password.interceptor';
import { refreshPasswordInterceptor } from 'core/modules/auth/validator/refresh-password.interceptor';
import { Module } from '../../../../packages/handler/Module';
import { AuthController } from '../controller/auth.controller';
import { loginInterceptor } from '../../../modules/auth/validator/login.interceptor';

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
            interceptors: [loginInterceptor],
            controller: AuthController.login,
            body: 'LoginDto'
        },
        {
            route: '/forgot-password',
            method: 'post',
            interceptors: [forgotPasswordInterceptor],
            controller: AuthController.requestForgotPassword,
            body: 'ForgotPasswordDto'
        },
        {
            route: '/refresh-password',
            method: 'post',
            interceptors: [refreshPasswordInterceptor],
            controller: AuthController.refreshPassword,
            body: 'ChangePasswordDto'
        },
    ]);
