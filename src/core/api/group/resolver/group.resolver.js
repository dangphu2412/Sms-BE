import { GroupType } from 'core/common/swagger/groupType';
import { Module } from '../../../../packages/handler/Module';
import { GroupController } from '../controller/group.controller';
import { ApiFilterSwagger } from '../../../common/swagger/filter';
import { CreateGroupInterceptor } from '../../../modules/group/validator/createGroup.interceptor';
import { IdObjectInterceptor } from '../../../modules/interceptor';
import { ObjectId } from '../../../common/swagger/objectId';

export const GroupResolver = Module.builder()
    .addPrefix({
        prefixPath: '/groups',
        tag: 'groups',
        module: 'GroupModule'
    })
    .register([
        {
            route: '/',
            method: 'post',
            interceptors: [new CreateGroupInterceptor()],
            body: 'CreateGroupDto',
            controller: GroupController.createOne,
            preAuthorization: true
        },
        {
            route: '/',
            method: 'get',
            params: ApiFilterSwagger,
            controller: GroupController.findAll,
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'get',
            params: [ObjectId, GroupType],
            controller: GroupController.findOne,
            interceptors: [new IdObjectInterceptor()],
            preAuthorization: true
        }
    ]);
