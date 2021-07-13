import { hasAdminOrLeaderRole, hasAdminRole } from 'core/modules/auth/guard/roleDomain';
import { interceptIdObject } from 'core/modules/mongoose/idObject.interceptor';
import { Module } from '../../../../packages/handler/Module';
import { GroupController } from '../controller/group.controller';
import { CreateGroupInterceptor } from '../../../modules/group/validator/createGroup.interceptor';
import { UpdateGroupInterceptor } from '../../../modules/group/validator/updateGroup.interceptor';
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
            body: 'CreateGroupDto',
            guards: [hasAdminRole],
            controller: GroupController.createOne,
            interceptors: [new CreateGroupInterceptor()],
            preAuthorization: true
        },
        {
            route: '/:id/children',
            method: 'get',
            params: [ObjectId],
            interceptors: [interceptIdObject],
            guards: [hasAdminOrLeaderRole],
            controller: GroupController.findChildren,
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'patch',
            params: [ObjectId],
            guards: [hasAdminOrLeaderRole],
            body: 'UpdateGroupDto',
            controller: GroupController.patchOne,
            interceptors: [interceptIdObject, new UpdateGroupInterceptor()],
            preAuthorization: true
        }
    ]);
