import { ObjectId } from 'core/common/swagger/objectId';
import { hasAdminRole } from 'core/modules/auth/guard/roleDomain';
import { CreateTimetableSettingInterceptor } from 'core/modules/timetableSetting/validator';
import { UpdateTimetableSettingInterceptor } from 'core/modules/timetableSetting/validator/update.interceptor';
import { Module } from 'packages/handler/Module';
import { TimetableSettingController } from '../controller/timetableSetting.controller';

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
