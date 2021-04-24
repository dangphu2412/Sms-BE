import { DuplicateException, NotFoundException } from '../../../../packages/httpException';
import { UserModel } from '../model/userModel';
import { BcryptService } from '../../auth/bcrypt';

class Service {
    constructor() {
        this.bcrypt = BcryptService;
    }

    findAll(queryFormation) {
      const queryBuilder = UserModel.find();
      const filterObj = {};
      const sortObj = {};
      queryFormation.filters.forEach(filter => {
        if (!filterObj[filter.column]) { filterObj[filter.column] = {}; }
        filterObj[filter.column][filter.sign] = filter.value;
      });

      queryFormation.sorts.forEach(sortItem => {
        sortObj[sortItem.sort] = sortItem.order;
      });

      if (queryFormation.search) {
        const searchObj = { $or: [] };
        const searchRegex = { $regex: queryFormation.search.value, $options: 'i' };
        queryFormation.search.criteria.forEach(searchField => {
          const obj = {};
          obj[searchField] = searchRegex;
          searchObj['$or'].push(obj);
        });
        queryBuilder.find(searchObj);
      }
      queryBuilder.find(filterObj);
      queryBuilder.sort(sortObj);
      return queryBuilder
        .limit(queryFormation.pagination.size)
        .skip(queryFormation.pagination.offset)
        .exec();
    }

    async createOne(data) {
        const user = await UserModel.findOne({ email: data.email }).select('email');
        if (user) {
          throw new DuplicateException('Email is used');
        }
        data.password = this.bcrypt.hash(data.password);
        const createdUser = await UserModel.create(data);
        return { _id: createdUser._id };
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
