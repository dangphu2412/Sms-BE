import { ObjectId } from 'core/common/swagger';
import { hasAdminRole } from 'core/modules/auth';
import { CreateTimetableSettingInterceptor, UpdateTimetableSettingInterceptor } from 'core/modules/timetable-setting';
import { Module } from 'packages/handler';
import { TimetableSettingController } from './timetable-setting.controller';

export const TimetableSettingResolver = Module.builder()
    .addPrefix({
        prefixPath: '/timetable-settings',
        tag: 'timetable-settings',
        module: 'TimetableSettingModule',
    })
    .register([
        {
            route: '/',
            method: 'post',
            interceptors: [new CreateTimetableSettingInterceptor()],
            controller: TimetableSettingController.createOne,
            guards: [hasAdminRole],
            body: 'CreateTimeTableSettingDto',
            preAuthorization: true,
        },
        {
            route: '/:id',
            method: 'put',
            interceptors: [new UpdateTimetableSettingInterceptor()],
            controller: TimetableSettingController.updateOne,
            params: [ObjectId],
            guards: [hasAdminRole],
            body: 'UpdateTimetableSettingDto',
            preAuthorization: true,
        }
    ]);
