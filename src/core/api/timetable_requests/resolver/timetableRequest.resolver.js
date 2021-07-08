import { CreateTimetableRequestInterceptor } from 'core/modules/timetable_request/validator/createTimetableRequest.interceptor';
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
                new CreateTimetableRequestInterceptor()
            ],
            body: 'CreateTimetableRequestDto',
            controller: TimetableRequestController.createOne,
            preAuthorization: true
        },
    ]);
