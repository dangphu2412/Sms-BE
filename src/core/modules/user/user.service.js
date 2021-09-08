import { merge } from 'lodash';
import moment from 'moment';

import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler';
import { LoggerFactory } from 'packages/logger';
import { QueryExtractor } from 'packages/restBuilder/modules/query';
import {
    DuplicateException, NotFoundException, InternalServerException,
} from 'packages/httpException';
import { FilterSign } from 'packages/restBuilder/enum';

import { ChangePasswordTemplate, MailTemplateAdapter, MailConsumer } from 'core/modules/mail';
import {
    toPageData, toPageDataWith, Optional, mapByKey
} from 'core/utils';
import { BcryptService } from 'core/modules/auth/service/bcrypt.service';
import { MONGOOSE_ID_KEY } from 'core/common/constants';
import { DocumentCleanerVisitor } from 'packages/restBuilder/core/dataHandler/document-cleaner.visitor';
import { unlink } from 'fs';
import { UserRepository } from './user.repository';
import { GroupRepository } from '../group';
import { TimetableRepository, TimetablePopulateKey } from '../timetable';
import { UserQueryService } from './user-query.service';
import { QueryField } from '../../common/query';
import { CreateUserValidator } from './validator';
import { MediaService } from '../document';

class UserServiceImpl extends DataPersistenceService {
    static RETRY_SEND_MAIL_TIMES = 3;

    constructor() {
        super(UserRepository);
        this.userQueryService = UserQueryService;
        this.mediaService = MediaService;
        this.bcryptService = BcryptService;
        this.groupRepository = GroupRepository;
        this.timetableRepository = TimetableRepository;
        this.createUserValidator = CreateUserValidator;
        this.logger = LoggerFactory.create(UserServiceImpl.name);
        this.mailConsumer = MailConsumer;
    }

    /**
     * @override getAndCount
     * @param {import('../../../packages/restBuilder/core/requestTransformer/RequestTransformer').RequestTransformer} reqTransformed
     * @note Make sure you understand pipeline in this case when you want to change something
     */
    async getAndCount(reqTransformed) {
        const query = QueryExtractor.extractToObject(reqTransformed);

        this.userQueryService
            .modifyQueryWithBirthDayMonth(query.selectedFieldMap, query.filterQuery, query.sortQuery);

        this.userQueryService
            .modifyQueryWithSpecializedGroupName(query.filterQuery, query.sortQuery);

        const rootAggregate = this.repository.getOverviewRootAggregate(
            query.selectedFieldMap,
            query.associates,
            query.filterQuery,
            query.sortQuery
        );

        const [resultBuilder, totalBuilder] = this.repository.toResultAndTotalBuilder(rootAggregate, reqTransformed);

        let result = this.repository.emptyAggregate();

        /**
         * Search will be apply to both result and total by facet
         */
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

    /**
     * @param {import('core/modules/user').CreateUserDto} createUserDto
     * @returns
     */
    async createOne(createUserDto) {
        const user = Optional
            .of(await this.repository.getByEmail(createUserDto.email))
            .throwIfPresent(new DuplicateException('Email is being used'))
            .get();

        await this.createUserValidator.validate(user, createUserDto);

        createUserDto.password = this.bcryptService.hash(createUserDto.password);

        const createdUser = await this.createOneSafety(
            createUserDto,
            () => new InternalServerException('Getting internal error during create new user')
        );

        await this.notifyMailToUser(createdUser);

        return { _id: createdUser._id };
    }

    async findTimetables(userId, query) {
        const [startDate, endDate] = this.extractDateRangeFromQuery(query);

        const timetables = await this.getMergedTimetableBetweenGroupAndSelf(
            startDate, endDate, userId
        );

        return toPageDataWith(timetables, timetables.length);
    }

    async findOne(id) {
        const user = await this.repository.getDetailById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    /**
     * 
     * @param {string} id
     * @param {import('core/modules/user').UpdateProfileDto} updateProfileDto
     * @returns
     */
    async updateProfile(id, updateProfileDto) {
        const user = await this.repository.findById(id, [], false);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        new DocumentCleanerVisitor(user.profile).visit();

        user.profile = { ...user.profile, ...updateProfileDto.profile };
        if (updateProfileDto.status) user.status = updateProfileDto.status;
        return user.save();
    }

    async updateAvatar(id, file, folderName) {
        const user = await this.repository.findById(id, [], false);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Delete old avatar if exist
        if (user.avatar) {
            const pattern = 'upload\\/(?:v\\d+\\/)?([^\\.]+)';
            const imageId = user.avatar.match(pattern)[1];

            const deleteResponse = await this.mediaService.deleteOne(imageId);
            if (deleteResponse.result === 'not found') {
                // delete image in server's hard drive
                unlink(file.path, err => {
                    if (err) {
                        this.logger.error(err.message);
                        throw new InternalServerException(err.message);
                    }
                });
                throw new NotFoundException('Image not found');
            }
        }

        // Upload image to cloudinary
        const uploadResponse = await this.mediaService.uploadOne(file, folderName);
        user.avatar = uploadResponse.url;
        return user.save();
    }

    deleteOne(id) {
        return this.softDeleteById(id, () => new NotFoundException('User not found'));
    }

    async changePassword(user, changePasswordDto) {
        const currentUser = await this.repository.getDetectingPasswordInfo(user.payload._id);

        this.bcryptService.verifyComparison(changePasswordDto.oldPassword, currentUser.password);

        const updateDoc = {
            password: this.bcryptService.hash(changePasswordDto.newPassword)
        };

        if (!currentUser.isPasswordChanged) {
            updateDoc.isPasswordChanged = true;
        }

        await this.repository.patchById(currentUser._id, updateDoc);
    }

    /** Smaller function do their story */

    /**
     * @returns {[string, string]}
     */
    extractDateRangeFromQuery(query) {
        const DEFAULT_DATE_RANGE = 7;
        return [
            query.startDate ?? moment().subtract(DEFAULT_DATE_RANGE, 'days').toISOString(),
            query.endDate ?? moment().add(DEFAULT_DATE_RANGE, 'days').toISOString()
        ];
    }

    /**
     *
     * @param {string} startDate
     * @param {string} endDate
     * @param {string} userId
     * @returns {Promise<[]>}
     */
    async getMergedTimetableBetweenGroupAndSelf(startDate, endDate, userId) {
        let selfJoinedGroups = await this.groupRepository.getByMemberIds([userId]);

        const selfJoinedGroupIds = mapByKey(selfJoinedGroups, MONGOOSE_ID_KEY);

        // Release the object heap
        selfJoinedGroups = null;

        const [joinedGroupTimetables, selfTimetables] = await Promise.all([
            this.timetableRepository.searchByDateRange(
                startDate, endDate, new QueryField(TimetablePopulateKey.group, FilterSign.$in, selfJoinedGroupIds)
            ),
            this.timetableRepository.searchByDateRange(
                startDate, endDate, new QueryField(TimetablePopulateKey.user, FilterSign.$eq, userId)
            )
        ]);

        return merge(joinedGroupTimetables, selfTimetables);
    }

    notifyMailToUser(createdUser) {
        return this.mailConsumer.add(
            MailTemplateAdapter(
                new ChangePasswordTemplate(createdUser.email),
                createdUser.email
            ),
            {
                attempts: UserServiceImpl.RETRY_SEND_MAIL_TIMES,
            }
        );
    }
}

export const UserService = new UserServiceImpl();
