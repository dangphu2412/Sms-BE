import { Module } from '../../../../packages/handler/Module';
import { UserController } from '../controller/user.controller';
import { ApiFilterSwagger } from '../../../common/swagger/filter';
import { IdObjectInterceptor } from '../../../modules/interceptor/IdObject/idObject.interceptor';
import { CreateUserInterceptor } from '../../../modules/user/validator/createUser.interceptor';
import { ObjectId } from '../../../common/swagger/objectId';

export const UserResolver = Module.builder()
    .addPrefix({
        prefixPath: '/users',
        tag: 'users',
        module: 'UserModule'
    })
    .register([
        {
            route: '/',
            method: 'get',
            params: ApiFilterSwagger,
            controller: UserController.findAll,
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'get',
            params: [ObjectId],
            interceptors: [new IdObjectInterceptor()],
            controller: UserController.findOne,
            preAuthorization: true
        },
        {
            route: '/',
            method: 'post',
            body: 'UpsertUserDto',
            interceptors: [new CreateUserInterceptor()],
            controller: UserController.createOne,
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'patch',
            params: [ObjectId],
            body: 'UpsertUserDto',
            interceptors: [
                new IdObjectInterceptor(),
                new CreateUserInterceptor()
            ],
            controller: UserController.patchOne,
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'delete',
            params: [ObjectId],
            interceptors: [new IdObjectInterceptor()],
            controller: UserController.deleteOne,
            preAuthorization: true
        }
    ]);
