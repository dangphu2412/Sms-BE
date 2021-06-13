// import { GroupController } from 'core/api/group/controller/group.controller';
import { FormController } from '../controller/form.controller';
import { Module } from '../../../../packages/handler/Module';
// import { ApiFilterSwagger } from '../../../common/swagger/filter';
// import { IdObjectInterceptor } from '../../../modules/interceptor';
// import { ObjectId } from '../../../common/swagger/objectId';
// import { CreateFormInterceptor } from '../../../modules/form/validator/createForm.interceptor';

export const FormResolver = Module.builder()
    .addPrefix({
        prefixPath: '/forms',
        tag: 'forms',
        module: 'FormModule'
    })
    .register([
        {
            route: '/',
            method: 'get',
            // interceptors: [new CreateFormInterceptor()],
            body: 'CreateFormDto',
            // guards:[hasAdminRole]
            controller: FormController.findAll,
            // preAuthorization: true
        },
        // {
        //     route: '/',
        //     method: 'get',
        //     interceptors: [],
        //     params: ApiFilterSwagger,
        //     // guards:[hasAdminRole]
        //     controller: FormController.findAll,
        //     preAuthorization: true
        // },
        // {
        //     route: '/:id',
        //     method: 'get',
        //     interceptors: [new IdObjectInterceptor()],
        //     params: [ObjectId],
        //     // guards:[hasAdminRole]
        //     controller: FormController.findOne,
        //     preAuthorization: true
        // },
    ]);
