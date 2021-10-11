import { Module } from 'packages/handler';
import { ActivityController } from './activity.controller';

export const ActivityResolver = Module.builder()
    .addPrefix({
        prefixPath: '/activities',
        tag: 'activities',
        module: 'Activity',
    })
    .register([
        {
            route: '/',
            method: 'get',
            controller: ActivityController.findAll,
            preAuthorization: true,
        },
    ]);
