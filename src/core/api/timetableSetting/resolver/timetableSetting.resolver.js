import { TimetableSettingInterceptor } from 'core/modules/timetableSetting/validator';
import { Module } from 'packages/handler/Module';
import { TimetableSettingController } from '../controller/timetableSetting.controller';

export const TimetableSettingResolver = Module.builder()
    .addPrefix({
        prefixPath: '/timetable-settings',
        tag: 'timetable-settings',
        module: 'TimetableSettingModule'
    })
    .register([
        {
            route: '/',
            method: 'post',
            interceptors: [new TimetableSettingInterceptor()],
            controller: TimetableSettingController.createOne,
            body: 'CreateTimeTableSettingDto',
        }
    ]);
