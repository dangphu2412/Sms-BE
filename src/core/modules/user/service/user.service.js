import { DuplicateException, NotFoundException } from '../../../../packages/httpException';
import { UserModel } from '../model/userModel';
import { BcryptService } from '../../auth/bcrypt';

class Service {
    constructor() {
        this.bcrypt = BcryptService;
    }

    findAll(queryFormation) {
      return UserModel.find()
        .limit(queryFormation.pagination.size)
        .skip(queryFormation.pagination.offset)
        .exec();
    }

    async createOne(data) {
        const user = await UserModel.findOne({ email: data.email });
        if (user) {
          throw new DuplicateException('Email is used');
        }
        data.password = this.bcrypt.hash(data.password);
        return UserModel.create(data);
    }

    async findOne({ id }) {
      const user = await UserModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }

    async patchOne({ id }, { email, password, roles }) {
      const user = await UserModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.email = email || user.email;
      user.password = password || user.password;
      user.roles = roles || user.roles;
      return user.save();
    }

    async deleteOne({ id }) {
      const user = await UserModel.findByIdAndDelete(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }

    count() {
        return UserModel.countDocuments({}).exec();
    }
}

export const UserService = new Service();
