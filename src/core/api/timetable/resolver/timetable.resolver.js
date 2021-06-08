import { CreateTimetableGroupInterceptor, CreateTimetableMemberInterceptor } from 'core/modules/timetable/validator';
import { Module } from 'packages/handler/Module';
import { TimetableController } from '../controller/timetable.controller';

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
