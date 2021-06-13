import { FormController } from '../controller/form.controller';
import { Module } from '../../../../packages/handler/Module';
import { CreateFormInterceptor } from '../../../modules/form/validator/createForm.interceptor';

export const FormResolver = Module.builder()
    .addPrefix({
        prefixPath: '/forms',
        tag: 'forms',
        module: 'FormModule'
    })
    .register([
        {
            route: '/',
            method: 'post',
            interceptors: [new CreateFormInterceptor()],
            body: 'CreateFormDto',
            guards: [],
            controller: FormController.createOne,
            preAuthorization: true
        }
    ]);
