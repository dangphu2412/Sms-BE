import { hasAdminOrLeaderRole } from 'core/modules/auth/guard/roleDomain';
import { Module } from '../../../../packages/handler/Module';
import { GroupTagController } from '../controller/groupTag.controller';

export const GroupTagResolver = Module.builder()
    .addPrefix({
        prefixPath: '/group-tags',
        tag: ['group-tags'],
        module: 'GroupTagModule'
    })
    .register([
        {
            route: '/groups',
            method: 'get',
            guards: [hasAdminOrLeaderRole],
            controller: GroupTagController.findAllWithGroups,
            preAuthorization: true
        }
    ]);
