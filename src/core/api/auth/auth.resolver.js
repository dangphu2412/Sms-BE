import { forgotPasswordInterceptor, loginInterceptor, refreshPasswordInterceptor } from 'core/modules/auth';
import { Module } from 'packages/handler';
import { AuthController } from './auth.controller';

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
