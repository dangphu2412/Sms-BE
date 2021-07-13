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
            interceptors: [
                new CreateTimetableRequestInterceptor()
            ],
            body: 'CreateTimetableRequestDto',
            controller: TimetableRequestController.createOne,
            preAuthorization: true
        },
    ]);
