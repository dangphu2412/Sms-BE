import { GroupType } from 'core/common/swagger/groupType';
import { hasAdminOrLeaderRole, hasAdminRole } from 'core/modules/auth/guard/roleDomain';
import { interceptIdObject } from 'core/modules/mongoose/idObject.interceptor';
import { Module } from '../../../../packages/handler/Module';
import { GroupController } from '../controller/group.controller';
import { CreateGroupInterceptor } from '../../../modules/group/validator/createGroup.interceptor';
import { UpdateGroupInterceptor } from '../../../modules/group/validator/updateGroup.interceptor';
import { DeleteMemberInterceptor } from '../../../modules/group/validator/deleteMember.interceptor';
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
            route: '/:id',
            method: 'get',
            params: [ObjectId, GroupType],
            interceptors: [interceptIdObject],
            guards: [hasAdminOrLeaderRole],
            controller: GroupController.findOne,
            preAuthorization: true
        },
        {
            route: '/:id/members',
            method: 'patch',
            params: [ObjectId],
            guards: [hasAdminOrLeaderRole],
            controller: GroupController.deleteMember,
            interceptors: [interceptIdObject, new DeleteMemberInterceptor()],
            preAuthorization: true
        },
        {
            route: '/:id',
            method: 'patch',
            params: [ObjectId],
            guards: [hasAdminOrLeaderRole],
            controller: GroupController.patchOne,
            interceptors: [interceptIdObject, new UpdateGroupInterceptor()],
            preAuthorization: true
        }
    ]);
