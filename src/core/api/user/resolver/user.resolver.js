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
            controller: UserController.findAll
        },
        {
            route: '/:id',
            method: 'get',
            params: [ObjectId],
            interceptors: [new IdObjectInterceptor()],
            controller: UserController.findOne
        },
        {
            route: '/',
            method: 'post',
            body: 'CreateDto',
            interceptors: [new CreateUserInterceptor()],
            controller: UserController.createOne
        },
        {
            route: '/:id',
            method: 'patch',
            params: [ObjectId],
            interceptors: [
                new IdObjectInterceptor(),
                new CreateUserInterceptor()
            ],
            controller: UserController.patchOne
        },
        {
            route: '/:id',
            method: 'delete',
            params: [ObjectId],
            interceptors: [new IdObjectInterceptor()],
            controller: UserController.deleteOne,
        }
    ]);
