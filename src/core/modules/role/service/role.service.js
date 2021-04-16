import { NotFoundException } from '../../../../packages/httpException';
import { RoleModel } from '../model/roleModel';

class Service {
    findAll({ page = 1, size = 10 }) {
      return RoleModel.find()
        .limit(size)
        .skip((page - 1) * size)
        .exec();
    }

    createOne({ name, permissions }) {
      const roleModel = new RoleModel();
      roleModel.name = name;
      roleModel.permissions = permissions;
      return roleModel.save();
    }

    async findOne({ id }) {
      const role = await RoleModel.findById(id).exec();
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    }

    async patchOne({ id }, { name, permissions }) {
      const role = await RoleModel.findById(id).exec();
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      role.name = name;
      role.permissions = permissions;
      return role.save();
    }

    deleteOne({ id }) {
      const deletedRole = RoleModel.findByIdAndDelete(id).exec();
      if (!deletedRole) {
        throw new NotFoundException('Role not found');
      }
      return deletedRole;
    }
}

export const RoleService = new Service();
