import { CreateTimetableGroupInterceptor, CreateTimetableMemberInterceptor } from 'core/modules/timetable';
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
            interceptors: [new CreateTimetableMemberInterceptor()],
            controller: TimetableController.createMemberTimetables,
            body: 'CreateMemeberTimetablesDtos',
            guards: [hasAdminRole],
            preAuthorization: true
        },
        {
            route: '/groups/register',
            method: 'post',
            interceptors: [new CreateTimetableGroupInterceptor()],
            controller: TimetableController.createGroupTimetable,
            body: 'CreateGroupTimetableDtos',
            preAuthorization: true
        },
    ]);