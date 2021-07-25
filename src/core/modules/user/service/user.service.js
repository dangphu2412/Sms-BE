import { Optional } from 'core/utils/optional';
import { keyBy } from 'lodash';
import moment from 'moment';
import { toJSON } from 'core/utils';
import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { MailConsumer } from 'core/modules/queue/consumer/mail.consumer';
import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { ChangePasswordTemplate } from 'core/modules/mail/template/change-password.template';
import { DuplicateException, NotFoundException, UnAuthorizedException } from '../../../../packages/httpException';
import { BcryptService } from '../../auth/service/bcrypt.service';
import { UserRepository } from '../repository/user.repository';
import { BadRequestException } from '../../../../packages/httpException/BadRequestException';
import { UserStatus } from '../../../common/enum/userStatus.enum';
import { toDateTime } from '../../../utils/timeConvert';
import { GroupRepository } from '../../group/repository/group.repository';
import { TimetableRepository } from '../../timetable/repository';
import { MailTemplateAdapter } from '../../queue/adapter/mail-template.adapter';

class Service extends DataPersistenceService {
    constructor() {
        super(UserRepository);
        this.bcryptService = BcryptService;
        this.groupRepository = GroupRepository;
        this.timetableRepository = TimetableRepository;
        this.logger = LoggerFactory.create('UserService');
        this.mailConsumer = MailConsumer;
    }

    async createOne(data) {
        let createdUser;
        const user = Optional
            .of(await this.repository.getByEmail(data.email))
            .throwIfPresent(new DuplicateException('Email is used'))
            .get();

        if (user?.status === UserStatus.SUSPEND) {
            throw new BadRequestException('This account is not available at the moment');
        }
        const userProfile = data.profile;
        if (userProfile?.birthday && !toDateTime(userProfile?.birthday)) {
            throw new BadRequestException('Invalid birthday datetime type');
        }
        data.password = this.bcryptService.hash(data.password);

        try {
            createdUser = await this.repository.model.create(data);
        } catch (e) {
            this.logger.error(e.message);
            return null;
        }
        await this.mailConsumer.add(
            MailTemplateAdapter(
                new ChangePasswordTemplate(createdUser.email),
                createdUser.email
            ),
            {
                attempts: 3,
            }
        );
        return { _id: createdUser._id };
    }

    async findTimetables(userId, query) {
        const { startDate = moment().subtract(7, 'days').toISOString(), endDate = moment().add(7, 'days').toISOString() } = query;
        Optional.of(await this.repository.findById(userId))
            .throwIfNotPresent(new NotFoundException('User Id is invalid'));
        const groups = await this.groupRepository.getByUserId(userId);
        const groupMapped = keyBy(groups, '_id');

        // Get  timetable of user and timetable of group (of user) in date range
        const conditionGroupTimetable = groups.map(group => ({ groupId: group.id, startDate, endDate }));
        const conditionUserTimetable = [{ userId, startDate, endDate }];
        const groupTimetable = await this.timetableRepository.getManyByGroupsAndDateRange(conditionGroupTimetable);
        const userTimetable = toJSON(await this.timetableRepository.getManyByGroupsAndDateRange(conditionUserTimetable));
        const timetableGroupMapped = keyBy(groupTimetable, 'registerTime._id');

        userTimetable.forEach((timetable, index) => {
            userTimetable[index].groups = [];
            // If the timetable of user concides with group timetable
            if (timetableGroupMapped[timetable.registerTime?._id]) {
                userTimetable[index].groups.push(groupMapped[timetableGroupMapped[timetable.registerTime?._id].groupId]);
            }
        });
        return {
            contents: userTimetable,
            meta: {
                totalRecord: userTimetable.length
            }
        };
    }

    async findOne({ id }) {
        const user = await this.repository.getDetailById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async patchOne({ id }, data) {
        Object.keys(data.profile).forEach(key => (data.profile[key] === undefined ? delete data.profile[key] : {}));

        const user = await this.repository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.profile = { ...user.profile, ...data.profile };
        if (data.status) user.status = data.status;
        return user.save();
    }

    // TODO: Update delete user in the future
    async deleteOne({ id }) {
        let user;
        try {
            user = await this.repository.model.findByIdAndDelete(id);
        } catch (e) {
            this.logger.error(e.message);
        }
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async changePassword(user, changePasswordDto) {
        const currentUser = await this.repository.model.findById(
            user.payload._id,
            '_id password remainingLoginTimes isPasswordChanged',
            {
                deletedAt: {
                    $eq: null
                }
            }
        );

        if (!this.bcryptService.compare(changePasswordDto.oldPassword, currentUser.password)) {
            throw new UnAuthorizedException('Your current password is incorrect');
        }

        const updateDoc = {
            password: this.bcryptService.hash(changePasswordDto.newPassword)
        };

        if (!currentUser.isPasswordChanged) {
            updateDoc.isPasswordChanged = true;
        }

        await this.repository.model.updateOne({
            _id: currentUser._id
        }, updateDoc);
    }
}

export const UserService = new Service();
