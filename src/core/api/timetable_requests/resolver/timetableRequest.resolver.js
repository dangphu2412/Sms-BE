import { TimetableRequestController } from '../controller/timetableRequest.controller';
import { Module } from '../../../../packages/handler/Module';
import { CreateTimetableRequestInterceptor } from '../../../modules/timetable_request/validator/createTimetableRequest.interceptor';

export const TimetableRequestResolver = Module.builder()
    .addPrefix({
        prefixPath: '/timetable_request',
        tag: 'timetable_request',
        module: 'TimetableRequestModule'
    })
    .register([
        {
            route: '/',
            method: 'post',
            interceptors: [new CreateTimetableRequestInterceptor()],
            body: 'CreateTimetableRequest',
            guards: [],
            controller: TimetableRequestController.createOne,
            preAuthorization: true
        }
    ]);
