import { createTimetableGroupInterceptor, createTimetableMemberInterceptor } from 'core/modules/timetable';
import { hasAdminRole } from 'core/modules/auth/guard';
import { Module } from 'packages/handler';
import { TimetableController } from './timetable.controller';

export const TimetableResolver = Module.builder()
    .addPrefix({
        prefixPath: '/timetables',
        tag: 'timetables',
        module: 'TimetableModule'
    })
    .register([
        {
            route: '/members/register',
            method: 'post',
            interceptors: [createTimetableMemberInterceptor],
            controller: TimetableController.createMemberTimetables,
            body: 'CreateMemberTimetableDtos',
            guards: [hasAdminRole],
            preAuthorization: true
        },
        {
            route: '/groups/register',
            method: 'post',
            interceptors: [createTimetableGroupInterceptor],
            controller: TimetableController.createGroupTimetable,
            body: 'CreateGroupTimetableDtos',
            preAuthorization: true
        },
    ]);
