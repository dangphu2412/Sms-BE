import { DuplicateException, NotFoundException } from '../../../../packages/httpException';
import { UserModel } from '../model/userModel';
import { BcryptService } from '../../auth/service/bcrypt.service';
import { UserRepository } from '../repository/user.repository';
import { logger } from '../../logger/winston';

class Service {
    constructor() {
        this.bcrypt = BcryptService;
        this.userRepository = UserRepository;
        this.logger = logger;
    }

    findAll(queryFormation) {
      return UserModel.find()
        .limit(queryFormation.pagination.size)
        .skip(queryFormation.pagination.offset)
        .exec();
    }

    async createOne(data) {
        let createdUser;
        const user = await this.userRepository.findOneByEmail(data.email, ['email']);

        if (user) {
          throw new DuplicateException('Email is used');
        }

        data.password = this.bcrypt.hash(data.password);

        try {
            createdUser = await this.userRepository.create(data);
        } catch (e) {
            this.logger.error(e.message);
            return null;
        }
        return { _id: createdUser._id };
    }

    async findOne({ id }) {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }

    async patchOne({ id }, { email, password, roles }) {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.email = email ?? user.email;
      user.password = password ?? user.password;
      user.roles = roles ?? user.roles;
      return user.save();
    }

    async deleteOne({ id }) {
        let user;
        try {
            user = await this.userRepository.findByIdAndDelete(id);
        } catch (e) {
          this.logger.error(e.message);
        }
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
