import { Module } from '../../../../packages/handler/Module';
import { PermissionController } from '../controller/permission.controller';
import { PermissionValidator } from '../../../modules/permission/validator/permission.validator';

export const PermissionResolver = Module.builder()
    .addPrefix({
        prefixPath: '/permissions',
        tag: 'permissions',
        module: 'PermissionModule'
    })
    .register([
        {
            route: '/',
            method: 'get',
            middlewares: [PermissionValidator.validateQuery()],
            controller: PermissionController.findAll
        },
        {
            route: '/',
            method: 'post',
            middlewares: [PermissionValidator.validatePost()],
            controller: PermissionController.createOne
        },
        {
          route: '/:id',
          method: 'patch',
          middlewares: [
            PermissionValidator.validateParam(),
            PermissionValidator.validatePatch()
          ],
          controller: PermissionController.patchOne
        },
        {
            route: '/:id',
            method: 'delete',
            middlewares: [PermissionValidator.validateParam()],
            controller: PermissionController.deleteOne,
        }
    ]);
