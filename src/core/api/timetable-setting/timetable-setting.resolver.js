import { ObjectId } from 'core/common/swagger';
import { hasAdminRole } from 'core/modules/auth';
import { createTimetableSettingInterceptor, updateTimetableSettingInterceptor } from 'core/modules/timetable-setting';
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
            method: 'get',
            controller: TimetableSettingController.findAll,
            preAuthorization: true,
        },
        {
            route: '/',
            method: 'post',
            interceptors: [createTimetableSettingInterceptor],
            controller: TimetableSettingController.createOne,
            guards: [hasAdminRole],
            body: 'CreateTimeTableSettingDto',
            preAuthorization: true,
        },
        {
            route: '/:id',
            method: 'put',
            interceptors: [updateTimetableSettingInterceptor],
            controller: TimetableSettingController.updateOne,
            params: [ObjectId],
            guards: [hasAdminRole],
            body: 'UpdateTimetableSettingDto',
            preAuthorization: true,
        }
    ]);
