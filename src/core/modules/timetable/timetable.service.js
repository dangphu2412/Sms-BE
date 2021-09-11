import keyBy from 'lodash/keyBy';
import { ActivityRepository } from 'core/modules/activity/activity.repository';
import { UnprocessableEntityException } from 'packages/httpException';
import { toObjectId } from 'core/modules/mongoose/utils/objectId.utils';
import { LoggerFactory } from 'packages/logger';
import { WeakSetObjectId } from 'core/modules/mongoose/weak-set-objectid';
import { takeInvalidIds } from 'core/modules/mongoose/utils/array.utils';
import { TimetableRepository } from './timetable.repository';
import { TimetableSettingRepository } from '../timetable-setting';
import { mapToModel } from './timtable.mapper';

class TimetableServiceImpl {
    constructor() {
        this.logger = LoggerFactory.create(TimetableServiceImpl.name);
        this.timetableRepository = TimetableRepository;
        this.timetableSettingRepository = TimetableSettingRepository;
        this.activityRepository = ActivityRepository;
    }

    /**
     * @param {import('.').ICreateMemberTimetableDto[]} dtos
     */
    async createMemberTimetables(dtos) {
        this.#mustNotContainsDuplicatedUserWithTimetableSetting(dtos);

        let activityIds = new WeakSetObjectId();
        let timetableSettingIds = new WeakSetObjectId();

        dtos.forEach(currentDto => {
            activityIds.add(toObjectId(currentDto.activityId));
            timetableSettingIds.add(toObjectId(currentDto.registerTimeId));
        });

        activityIds = activityIds.toArray();
        timetableSettingIds = timetableSettingIds.toArray();

        const activities = await this.activityRepository.findByIds(activityIds);

        if (activities.length !== activityIds.length) {
            const invalidActivityIds = takeInvalidIds(activityIds, activities);
            throw new UnprocessableEntityException(`Invalid activity ids: ${invalidActivityIds.toString()}`);
        }

        const activeTimetableSettings = await this.timetableSettingRepository.findActiveTimetableSettingsByIds(timetableSettingIds);

        if (activeTimetableSettings.length !== timetableSettingIds.length) {
            const invalidTimetableSettingIds = takeInvalidIds(timetableSettingIds, activeTimetableSettings);
            throw new UnprocessableEntityException(`Invalid timetable setting ids: ${invalidTimetableSettingIds.toString()}`);
        }

        const activeTimetableSettingsKeyById = keyBy(activeTimetableSettings, '_id');

        const timetableKeyByRelatedUser = await this.#getTimetablesKeyByRelatedUser(dtos);

        const newTimetables = [];
        const patchTimetables = [];

        dtos.forEach(dto => {
            if (timetableKeyByRelatedUser[dto.userId]) {
                if (this.#timetableNotContainActivityId(timetableKeyByRelatedUser[dto.userId], dto.activityId)) {
                    this.#addActivityIdIntoTimetable(timetableKeyByRelatedUser[dto.userId], dto.activityId);

                    patchTimetables.push(timetableKeyByRelatedUser[dto.userId]);
                }
            } else {
                const model = mapToModel(dto);
                model.user = toObjectId(dto.userId);
                model.registerTime = activeTimetableSettingsKeyById[dto.userId];

                newTimetables.push(model);
            }
        });

        try {
            await this.timetableRepository.model.insertMany(newTimetables);
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error(error.stack);
            throw new UnprocessableEntityException(error.message);
        }

        try {
            await this.timetableRepository.batchUpdate(patchTimetables);
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error(error.stack);
            throw new UnprocessableEntityException(error.message);
        }
    }

    /**
     * @param {import('.').ICreateGroupTimetableDto[]} dtos
     */
    async createGroupTimetable(dtos) {
        this.#mustNotContainsDuplicatedGroupWithTimetableSetting();

        let activityIds = new WeakSetObjectId();
        let timetableSettingIds = new WeakSetObjectId();

        dtos.forEach(currentDto => {
            activityIds.add(toObjectId(currentDto.activityId));
            timetableSettingIds.add(toObjectId(currentDto.registerTimeId));
        });

        activityIds = activityIds.toArray();
        timetableSettingIds = timetableSettingIds.toArray();

        const activities = await this.activityRepository.findByIds(activityIds);

        if (activities.length !== activityIds.length) {
            const invalidActivityIds = takeInvalidIds(activityIds, activities);
            throw new UnprocessableEntityException(`Invalid activity ids: ${invalidActivityIds.toString()}`);
        }

        const activeTimetableSettings = await this.timetableSettingRepository.findActiveTimetableSettingsByIds(timetableSettingIds);

        if (activeTimetableSettings.length !== timetableSettingIds.length) {
            const invalidTimetableSettingIds = takeInvalidIds(timetableSettingIds, activeTimetableSettings);
            throw new UnprocessableEntityException(`Invalid timetable setting ids: ${invalidTimetableSettingIds.toString()}`);
        }

        const activeTimetableSettingsKeyById = keyBy(activeTimetableSettings, '_id');

        const timetableKeyByRelatedGroup = await this.#getTimetablesKeyByRelatedGroup(dtos);

        const newTimetables = [];
        const patchTimetables = [];

        dtos.forEach(dto => {
            if (timetableKeyByRelatedGroup[dto.groupId]) {
                if (this.#timetableNotContainActivityId(timetableKeyByRelatedGroup[dto.groupId], dto.activityId)) {
                    this.#addActivityIdIntoTimetable(timetableKeyByRelatedGroup[dto.groupId], dto.activityId);

                    patchTimetables.push(timetableKeyByRelatedGroup[dto.groupId]);
                }
            } else {
                const model = mapToModel(dto);
                model.group = toObjectId(dto.groupId);
                model.registerTime = activeTimetableSettingsKeyById[dto.groupId];

                newTimetables.push(model);
            }
        });

        try {
            await this.timetableRepository.model.insertMany(newTimetables);
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error(error.stack);
            throw new UnprocessableEntityException(error.message);
        }

        try {
            await this.timetableRepository.batchUpdate(patchTimetables);
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error(error.stack);
            throw new UnprocessableEntityException(error.message);
        }
    }

    /**
     * @param {import('.').ICreateMemberTimetableDto[]} dtos
     */
    #mustNotContainsDuplicatedUserWithTimetableSetting = dtos => {
        const uniqueUserWithTimetableSettingMap = {};

        dtos.forEach(currentDto => {
            if (uniqueUserWithTimetableSettingMap[`${currentDto.userId}${currentDto.registerTimeId}`]) {
                throw new UnprocessableEntityException(
                    `User with id: ${currentDto.userId} is creating duplicated timetableSetting`
                );
            } else {
                uniqueUserWithTimetableSettingMap[`${currentDto.userId}${currentDto.registerTimeId}`] = true;
            }
        });
    }

    /**
     * @param {import('.').ICreateGroupTimetableDto[]} dtos
     */
    #mustNotContainsDuplicatedGroupWithTimetableSetting = dtos => {
        const uniqueUserWithTimetableSettingMap = {};

        dtos.forEach(currentDto => {
            if (uniqueUserWithTimetableSettingMap[`${currentDto.groupId}${currentDto.registerTimeId}`]) {
                throw new UnprocessableEntityException(
                    `Group with id: ${currentDto.groupId} is creating duplicated timetableSetting`
                );
            } else {
                uniqueUserWithTimetableSettingMap[`${currentDto.groupId}${currentDto.registerTimeId}`] = true;
            }
        });
    }

    /**
     * @param {import('.').ICreateMemberTimetableDto[]} dtos
     */
    #getTimetablesKeyByRelatedUser = async dtos => {
        const conditions = dtos?.map(dto => ({
            user: toObjectId(dto.userId),
            'registerTime._id': toObjectId(dto.registerTimeId)
        }));

        const timetables = await this.timetableRepository.find({
            $or: conditions,
            isActive: true,
        });

        return keyBy(timetables, 'user');
    }

    /**
     * @param {import('.').ICreateGroupTimetableDto[]} dtos
     */
    #getTimetablesKeyByRelatedGroup = async dtos => {
        const conditions = dtos?.map(dto => ({
            group: toObjectId(dto.groupId),
            'registerTime._id': toObjectId(dto.registerTimeId)
        }));

        const timetables = await this.timetableRepository.find({
            $or: conditions,
            isActive: true,
        });

        return keyBy(timetables, 'group');
    }

    #timetableNotContainActivityId = (timetable, activityId) => !timetable.activities.some(activity => activity.equals(activityId))

    #addActivityIdIntoTimetable = (timetable, activityId) => {
        timetable.activities.push(toObjectId(activityId));
    }
}

export const TimetableService = new TimetableServiceImpl();
