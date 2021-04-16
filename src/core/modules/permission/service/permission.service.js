import { NotFoundException } from '../../../../packages/httpException';
import { PermissionModel } from '../model/permissionModel';

class Service {
    findAll({ page = 1, size = 10 }) {
      return PermissionModel.find()
        .limit(size)
        .skip((page - 1) * size)
        .exec();
    }

    createOne({ name }) {
      const permissionModel = new PermissionModel();
      permissionModel.name = name;
      return permissionModel.save();
    }

    findOne({ id }) {
      return PermissionModel.findById(id).exec();
    }

    async patchOne({ id }, { name }) {
      const permission = await PermissionModel.findById(id).exec();
      if (!permission) {
        throw new NotFoundException('Role not found');
      }
      permission.name = name;
      return permission.save();
    }

    deleteOne({ id }) {
      return PermissionModel.findByIdAndDelete(id).exec();
    }
}

export const PermissionService = new Service();
