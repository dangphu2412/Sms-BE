import { Module } from '../../../../packages/handler/Module';
import { RoleController } from '../controller/role.controller';
import { RoleValidator } from '../../../modules/role/validator/role.validator';

export const RoleResolver = Module.builder()
    .addPrefix({
        prefixPath: '/roles',
        tag: 'roles',
        module: 'RoleModule'
    })
    .register([
        {
            route: '/',
            method: 'get',
            middlewares: [RoleValidator.validateQuery()],
            controller: RoleController.findAll
        },
        {
            route: '/:id',
            method: 'get',
            middlewares: [RoleValidator.validateParam()],
            controller: RoleController.findOne
        },
        {
            route: '/',
            method: 'post',
            middlewares: [RoleValidator.validatePost()],
            controller: RoleController.createOne
        },
        {
          route: '/:id',
          method: 'patch',
          middlewares: [
            RoleValidator.validateParam(),
            RoleValidator.validatePatch(),
          ],
          controller: RoleController.patchOne
        },
        {
            route: '/:id',
            method: 'delete',
            middlewares: [RoleValidator.validateParam()],
            controller: RoleController.deleteOne,
        }
    ]);
