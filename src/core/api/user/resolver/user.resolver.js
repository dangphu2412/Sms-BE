import { hasAdminRole, hasLeaderRole } from 'core/modules/auth/guard/roleDomain';
import { Module } from '../../../../packages/handler/Module';
import { UserController } from '../controller/user.controller';
import { ApiFilterSwagger } from '../../../common/swagger/filter';
import { IdObjectInterceptor } from '../../../modules/interceptor';
import { CreateUserInterceptor } from '../../../modules/user/validator/createUser.interceptor';
import { UpdateProfileInterceptor } from '../../../modules/user/validator/updateProfile.interceptor';
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
            guards: [hasAdminRole],
            controller: UserController.findAll,
            preAuthorization: true
        },
        {
            route: '/:id/timetables',
            method: 'get',
            params: [ObjectId],
            interceptors: [new IdObjectInterceptor()],
            guards: [hasLeaderRole],
            controller: UserController.findTimetables,
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'get',
            params: [ObjectId],
            interceptors: [new IdObjectInterceptor()],
            guards: [hasAdminRole],
            controller: UserController.findOne,
            preAuthorization: true
        },
        {
            route: '/',
            method: 'post',
            body: 'UpsertUserDto',
            interceptors: [new CreateUserInterceptor()],
            guards: [hasAdminRole],
            controller: UserController.createOne,
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'patch',
            params: [ObjectId],
            body: 'UpdateProfileDto',
            interceptors: [
                new IdObjectInterceptor(),
                new UpdateProfileInterceptor()
            ],
            guards: [hasAdminRole],
            controller: UserController.patchOne,
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'delete',
            params: [ObjectId],
            guards: [hasAdminRole],
            interceptors: [new IdObjectInterceptor()],
            controller: UserController.deleteOne,
            preAuthorization: true
        }
    ]);
