import { Optional } from 'core/utils/optional';
import { keyBy } from 'lodash';
import moment from 'moment';
import { toJSON } from 'core/utils';
import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler';
import { MailConsumer } from 'core/modules/queue/consumer/mail.consumer';
import { LoggerFactory } from 'packages/logger';
import { ChangePasswordTemplate } from 'core/modules/mail';
import { FilterQuery, SortQuery } from 'packages/restBuilder/modules/query';
import { AggregateBuilder } from 'packages/restBuilder/core/queryBuilder';
import { FieldUtils } from 'packages/restBuilder/modules/utils';
import { FilterSign } from 'packages/restBuilder/enum';
import { toPageData, toPageDataWith } from 'core/utils/page.utils';
import {
    DuplicateException, NotFoundException, UnAuthorizedException, BadRequestException, InternalServerException, UnprocessableEntityExeception
} from 'packages/httpException';
import { BcryptService } from 'core/modules/auth/service/bcrypt.service';
import { UserRepository } from '../repository/user.repository';
import { UserStatus } from '../../../common/enum/userStatus.enum';
import { toDateTime } from '../../../utils/timeConvert';
import { GroupRepository } from '../../group/repository/group.repository';
import { TimetableRepository } from '../../timetable/repository';
import { MailTemplateAdapter } from '../../queue/adapter/mail-template.adapter';

class Service extends DataPersistenceService {
    static RETRY_SEND_MAIL_TIMES = 3;

    constructor() {
        super(UserRepository);
        this.bcryptService = BcryptService;
        this.groupRepository = GroupRepository;
        this.timetableRepository = TimetableRepository;
        this.logger = LoggerFactory.create('UserService');
        this.mailConsumer = MailConsumer;
    }

    /**
     * @override getAndCount
     * @param {import('../../../../packages/restBuilder/core/requestTransformer/RequestTransformer').RequestTransformer} reqTransformed
     * @note Make sure you understand pipeline in this case when you want to change something
     */
    async getAndCount(reqTransformed) {
        let filterSpecializedGroup;
        let sortSpecializedGroup;

        const filterQuery = new FilterQuery(reqTransformed.content.filters);
        const sortQuery = new SortQuery(reqTransformed.content.sorts);

        /** @type{Record<string, 1>} */
        const fieldsSelectedObject = reqTransformed.content.main;

        if (filterQuery.getQuery().birthdayMonth || sortQuery.getQuery().birthdayMonth) {
            Object.assign(fieldsSelectedObject, { birthdayMonth: FieldUtils.buildMonth('profile.birthday') });
        }

        if (filterQuery.getQuery().birthdayMonth) {
            const birthdayMonth = filterQuery.getColBySign('birthdayMonth', FilterSign.$eq);

            if (!birthdayMonth) {
                throw new BadRequestException(`Filter birthdayMonth must use ${FilterSign.$eq} signature`);
            }

            filterQuery.addFilter(
                'birthdayMonth',
                FilterSign.$eq,
                Number.parseInt(birthdayMonth, 10)
            );
        }

        if (filterQuery.getQuery()['specializedGroup.name']) {
            filterSpecializedGroup = {
                'specializedGroup.name': {
                    $eq: filterQuery.getQuery()['specializedGroup.name']['$eq']
                }
            };
            filterQuery.removeFilterByColumn('specializedGroup.name');
        }

        if (sortQuery.getQuery()['specializedGroup.name']) {
            sortSpecializedGroup = {
                'specializedGroup.name': sortQuery.getQuery()['specializedGroup.name']
            };
            sortQuery.removeSortByKey('specializedGroup.name');
        }

        const resultBuilder = AggregateBuilder.builder(this.repository.model)
            .setAssociates(reqTransformed.content.associates)
            .addUnwind('specializedGroup')
            .setSelectedFields(fieldsSelectedObject)
            .addFilter(filterQuery)
            .addSort(sortQuery)
            .addOffsetAndLimit(
                reqTransformed.content.pagination.offset,
                reqTransformed.content.pagination.size
            );

        const totalBuilder = AggregateBuilder.builder(this.repository.model)
            .setAssociates(reqTransformed.content.associates)
            .addUnwind('specializedGroup')
            .setSelectedFields(fieldsSelectedObject)
            .addFilter(filterQuery)
            .addSort(sortQuery);

        if (filterSpecializedGroup) {
            resultBuilder.getBuilder().match(filterSpecializedGroup);
            totalBuilder.getBuilder().match(filterSpecializedGroup);
        }

        if (sortSpecializedGroup) {
            resultBuilder.getBuilder().sort(sortSpecializedGroup);
            totalBuilder.getBuilder().sort(sortSpecializedGroup);
        }

        // Count should be the final pipeline
        totalBuilder.addCount('total');

        let result = AggregateBuilder.builder(this.repository.model);

        if (reqTransformed.content.search) {
            result.addSearch(reqTransformed.content.search.value);
        }

        result = await result.getBuilder().facet({
            content: resultBuilder.getPipeline(),
            total: totalBuilder.getPipeline()
        });

        /**
         * @summary facet will return an array with one object
         * That object will contains two keys: content and total
         * Each key will return an array with one object inside
         * So if total return nothing then we have to safety check
         * For more information, please take a look at: https://docs.mongodb.com/manual/reference/operator/aggregation/facet/
         * @author dangphu2412
         * @note this maybe remove if we decide to move this aggregate build flow into data handler
        */
        const total = result[0].total[0] ? result[0].total[0].total : 0;

        return toPageData(reqTransformed, result[0].content, total);
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

        if (await this.groupRepository.isParent(data.specilizedGroupId)) {
            throw new UnprocessableEntityExeception(
                'Group relate to specializedGroupId is not exist or not a parent group'
            );
        } else {
            data.specilizedGroup = data.specilizedGroupId;
            delete data.specilizedGroupId;
        }

        data.password = this.bcryptService.hash(data.password);

        try {
            createdUser = await this.repository.model.create(data);
        } catch (e) {
            this.logger.error(e.message);
            this.logger.error(e.stack);
            throw new InternalServerException('Getting internal error during create new user');
        }

        await this.mailConsumer.add(
            MailTemplateAdapter(
                new ChangePasswordTemplate(createdUser.email),
                createdUser.email
            ),
            {
                attempts: Service.RETRY_SEND_MAIL_TIMES,
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
        return toPageDataWith(userTimetable, userTimetable.length);
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
