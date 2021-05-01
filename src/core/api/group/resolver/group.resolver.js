import { Module } from '../../../../packages/handler/Module';
import { GroupController } from '../controller/group.controller';
import { ApiFilterSwagger } from '../../../common/swagger/filter';
import { CreateGroupInterceptor } from '../../../modules/group/validator/createGroup.interceptor';
import { IdObjectInterceptor } from '../../../modules/interceptor/IdObject/idObject.interceptor';
import { ObjectId } from '../../../common/swagger/objectId';

export const GroupResolver = Module.builder()
    .addPrefix({
        prefixPath: '/groups',
        tag: 'groups',
        module: 'GroupModule'
    })
    .register([
        {
            route: '/',
            method: 'post',
            interceptors: [new CreateGroupInterceptor()],
            body: 'createGroupDto',
            controller: GroupController.createOne,
            // preAuthorization: true
        },
        {
            route: '/:id',
            method: 'get',
            params: [ObjectId],
            controller: GroupController.findOne,
            interceptors: [new IdObjectInterceptor()],
            // preAuthorization: true
        }
    ]);
