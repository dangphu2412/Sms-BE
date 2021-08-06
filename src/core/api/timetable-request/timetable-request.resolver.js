import { CreateTimetableRequestInterceptor, GetTimetableRequestQueryInterceptor } from 'core/modules/timetable-request';
import { getTimetableRequestQuerySwagger } from 'core/modules/timetable-request/dto/get-timetable-request.swagger';
import { Module } from 'packages/handler';
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
            interceptors: [
                new GetTimetableRequestQueryInterceptor()
            ],
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
    ]);
