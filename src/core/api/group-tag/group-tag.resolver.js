import { QueryCriteriaDocument } from 'core/common/swagger';
import { hasAdminOrLeaderRole } from 'core/modules/auth';
import { Module } from 'packages/handler';
import { GroupTagController } from './group-tag.controller';
import SearchGroupTags from './query/group-tag-search.query.json';

export const GroupTagResolver = Module.builder()
    .addPrefix({
        prefixPath: '/group-tags',
        tag: ['group-tags'],
        module: 'GroupTagModule'
    })
    .register([
        {
            route: '/',
            method: 'get',
            guards: [hasAdminOrLeaderRole],
            params: [QueryCriteriaDocument.search(`Support search fields: ${SearchGroupTags.searchCriteria.toString()}`)],
            controller: GroupTagController.findAll,
            preAuthorization: true
        },
        {
            route: '/groups',
            method: 'get',
            guards: [hasAdminOrLeaderRole],
            controller: GroupTagController.findAllWithGroups,
            preAuthorization: true
        }
    ]);
