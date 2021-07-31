import { hasAdminRole } from 'core/modules/auth/guard/roleDomain';
import { interceptIdObject } from 'core/modules/mongoose/idObject.interceptor';
import { actionTimetableRequestSwagger } from 'core/modules/timetable_request/dto';
import { getTimetableRequestQuerySwagger } from 'core/modules/timetable_request/dto/getTimetableRequestSwagger';
import { CreateTimetableRequestInterceptor } from 'core/modules/timetable_request/validator/createTimetableRequest.interceptor';
import { GetTimetableRequestQueryInterceptor } from 'core/modules/timetable_request/validator/getTimetableRequestQuery.interceptor';
import { Module } from 'packages/handler/Module';
import { TimetableRequestController } from '../controller/timetableRequest.controller';

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
            interceptors: [
                new GetTimetableRequestQueryInterceptor()
            ],
            controller: TimetableRequestController.getByType,
            preAuthorization: true
        },
        {
            route: '/',
            method: 'post',
            params: actionTimetableRequestSwagger,
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
