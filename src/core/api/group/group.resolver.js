import { ObjectId } from 'core/common/swagger';
import { hasAdminOrLeaderRole, hasAdminRole } from 'core/modules/auth';
import { createGroupInterceptor, updateGroupInterceptor } from 'core/modules/group';
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
            body: 'CreateGroupDto',
            guards: [hasAdminRole],
            controller: GroupController.createOne,
            interceptors: [createGroupInterceptor],
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
            interceptors: [interceptIdObject, updateGroupInterceptor],
            preAuthorization: true
        }
    ]);
