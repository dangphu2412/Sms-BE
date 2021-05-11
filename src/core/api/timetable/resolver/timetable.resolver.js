import { CreateTimetableInterceptor } from 'core/modules/timetable/validator';
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
            route: '/',
            method: 'post',
            interceptors: [new CreateTimetableInterceptor()],
            controller: TimetableController.createTimetable,
            preAuthorization: true
        }
    ]);
