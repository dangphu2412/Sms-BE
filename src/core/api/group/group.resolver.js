import { ObjectId } from 'core/common/swagger';
import { hasAdminOrLeaderRole, hasAdminRole } from 'core/modules/auth';
import { groupCreationInterceptor, groupModificationInterceptor } from 'core/modules/group';
import { interceptIdObject } from 'core/modules/mongoose/objectId.interceptor';
import { Module } from 'packages/handler';
import { GroupController } from './group.controller';

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
            body: 'GroupCreationDto',
            guards: [hasAdminRole],
            controller: GroupController.createOne,
            interceptors: [groupCreationInterceptor],
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
            body: 'GroupModificationDto',
            controller: GroupController.patchOne,
            interceptors: [interceptIdObject, groupModificationInterceptor],
            preAuthorization: true
        }
    ]);
