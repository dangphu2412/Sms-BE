import { DuplicateException, NotFoundException } from '../../../../packages/httpException';
import { BcryptService } from '../../auth/service/bcrypt.service';
import { UserRepository } from '../repository/user.repository';
import { logger } from '../../logger/winston';
import { BadRequestException } from '../../../../packages/httpException/BadRequestException';

class Service {
    constructor() {
        this.bcrypt = BcryptService;
        this.userRepository = UserRepository;
        this.logger = logger;
    }

    /**
     * ENHANCEMENT:
     * - Will move all these logic into restBuilder package
     * - Package contains: FilterDocument, SortDocument, SearchDocument
     * @param reqTransformed
     */
    async findAll(reqTransformed) {
        const findBuilder = this.userRepository.model.find();
        const countBuilder = this.userRepository.model.find();
        const filterDocument = {};
        const sortDocument = {};

        reqTransformed.filters.forEach(filter => {
            if (!filterDocument[filter.column]) {
                filterDocument[filter.column] = {};
            }

            filterDocument[filter.column][filter.sign] = filter.value;
        });

        reqTransformed.sorts.forEach(sortItem => {
            sortDocument[sortItem.sort] = sortItem.order;
        });

        if (reqTransformed.search) {
            const searchObj = {
                $or: []
            };

            const searchRegex = {
                $regex: reqTransformed.search.value, $options: 'i'
            };
            reqTransformed.search.criteria.forEach(searchField => {
                const obj = {};
                obj[searchField] = searchRegex;
                searchObj['$or'].push(obj);
            });
            findBuilder.find(searchObj);
            countBuilder.find(searchObj);
        }

        findBuilder.find(filterDocument);
        findBuilder.sort(sortDocument);

        countBuilder.find(filterDocument);
        countBuilder.sort(sortDocument);
        const users = findBuilder
            .limit(reqTransformed.pagination.size)
            .skip(reqTransformed.pagination.offset);

        const countUsers = countBuilder.countDocuments();
        return Promise.all([
            users,
            countUsers
        ]);
    }

    async createOne(data) {
        let createdUser;
        const user = await this.userRepository.getByEmail(data.email);

        if (user && user?.deletedAt === null) {
          throw new DuplicateException('Email is used');
        }

        if (!user?.deletedAt) {
          throw new BadRequestException('This account is not available at the moment');
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
      const user = await this.userRepository.getDetailById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }

    // TODO: Update user in the future
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

    // TODO: Update delete user in the future
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
}

export const UserService = new Service();
