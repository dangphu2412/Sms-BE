import { CreateTimetableRequestInterceptor } from 'core/modules/timetable_request/validator/createTimetableRequest.interceptor';
import { CreateTimetableRequestQueryInterceptor } from 'core/modules/timetable_request/validator/createTimetableRequestQuery.interceptor';
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
            route: '/add',
            method: 'post',
            interceptors: [
                new CreateTimetableRequestQueryInterceptor(),
                new CreateTimetableRequestInterceptor()
            ],
            body: 'CreateTimetableRequest',
            controller: TimetableRequestController.createOne,
            preAuthorization: true
        },
    ]);
