import { hasAdminOrLeaderRole } from 'core/modules/auth';
import { Module } from 'packages/handler';
import { GroupTagController } from './group-tag.controller';

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
