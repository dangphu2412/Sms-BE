import { hasAdminRole } from 'core/modules/auth/guard/role.manager';
import { CreateTimetableRequestInterceptor, getTimetableRequestQueryInterceptor } from 'core/modules/timetable-request';
import { getTimetableRequestQuerySwagger } from 'core/modules/timetable-request/dto/get-timetable-request.swagger';
import { Module } from 'packages/handler';
import { interceptIdObject } from 'core/modules/mongoose/objectId.interceptor';
import { TimetableRequestController } from './timetable-request.controller';

export const TimetableRequestResolver = Module.builder()
    .addPrefix({
        prefixPath: '/timetable-requests',
        tag: 'timetable-request',
        module: 'TimetableRequestModule'
    })
    .register([
        {
            route: '/',
            method: 'get',
            params: getTimetableRequestQuerySwagger,
            interceptors: [getTimetableRequestQueryInterceptor],
            controller: TimetableRequestController.getByType,
            preAuthorization: true
        },
        {
            route: '/',
            method: 'post',
            interceptors: [
                new CreateTimetableRequestInterceptor()
            ],
            body: 'CreateTimetableRequestDto',
            controller: TimetableRequestController.createOne,
            preAuthorization: true
        },
        {
            route: '/:id/approve',
            method: 'patch',
            interceptors: [interceptIdObject],
            guards: [hasAdminRole],
            controller: TimetableRequestController.approveOne,
            preAuthorization: true
        },
        {
            route: '/:id/reject',
            method: 'patch',
            interceptors: [interceptIdObject],
            guards: [hasAdminRole],
            controller: TimetableRequestController.rejectOne,
            preAuthorization: true
        },
    ]);
