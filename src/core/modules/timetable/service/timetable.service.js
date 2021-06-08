import keyBy from 'lodash/keyBy';
import { ActivityRepository } from 'core/modules/activity/repository';
import { UnprocessableEntityExeception } from 'packages/httpException';
import { TimetableRepository } from '../repository';
import { TimetableSettingRepository } from '../../timetableSetting/repository';

class Service {
    constructor() {
        this.timetableRepository = TimetableRepository;
        this.timetableSettingRepository = TimetableSettingRepository;
        this.activityRepository = ActivityRepository;
    }

    /**
     * @param {CreateTimetableDtos} payload
     */
    async createMemberTimetables(dtos) {
        const activityIds = [];
        const registerTimeIds = [];

        dtos.forEach(dto => {
            activityIds.push(dto.activityId);
            registerTimeIds.push(dto.registerTimeId);
        });

        const userAndRegisterTimeSet = dtos.map(({ userId, registerTimeId }) => `${userId}-${registerTimeId}`);
        if (userAndRegisterTimeSet.length !== [...new Set(userAndRegisterTimeSet)].length) {
            throw new UnprocessableEntityExeception(
                'userId and registerTimeId are exclusive unique',
            );
        }

        const activityIdSet = [...new Set(activityIds)];
        const registerTimeIdSet = [...new Set(registerTimeIds)];
        const activities = await this.activityRepository.findWithActiveByIds(
            activityIds,
            '_id deletedAt',
        );

        if (activityIdSet.length !== activities.length) {
            throw new UnprocessableEntityExeception(
                'activity in payload is unexisted or deleted',
            );
        }

        const registerTimetables = await this.timetableSettingRepository.findWithActiveByIds(
            registerTimeIdSet,
        );
        const registerTimetableSettingMap = keyBy(registerTimetables, '_id');
        const currentTimetableOfUser = await this.timetableRepository.getManyByUserAndRegisterTime(dtos);
        const currentTimetableOfUserMap = keyBy(
            currentTimetableOfUser,
            'userId',
        );

        dtos.forEach((item, index) => {
            item.registerTime = registerTimetableSettingMap[item.registerTimeId];

            delete item.registerTimeId;

            if (!item.registerTime) {
                throw new UnprocessableEntityExeception(
                    'registerTime in payload is unexisted or deleted',
                );
            }

            // If user has been registered for the timetable_settings --> append to it
            if (currentTimetableOfUserMap[item.userId]) {
                if (
                    !currentTimetableOfUserMap[item.userId].activities.includes(
                        item.activityId,
                    )
                ) {
                    currentTimetableOfUserMap[item.userId].activities.push(
                        item.activityId,
                    );
                }
                dtos[index] = currentTimetableOfUserMap[item.userId];
            } else {
                dtos[index].activities = [item.activityId];
            }
            delete item.activityId;
        });

        const existedTimeTableIds = (dtos.filter(timetable => timetable._id) || []).map(
            timetable => timetable._id
        );
        await this.timetableRepository.createMany(dtos.filter(timetable => !timetable._id));
        if (existedTimeTableIds.length) {
            await Promise.all(dtos.filter(timetable => timetable._id !== null)?.map(async timetable => {
                await this.timetableRepository.updateById(timetable._id, timetable);
            }));
        }
    }

    async createGroupTimetable(dtos) {
        const groupAndRegisterTimeSet = dtos.map(({ groupId, registerTimeId }) => `${groupId}-${registerTimeId}`);
        if (groupAndRegisterTimeSet.length !== [...new Set(groupAndRegisterTimeSet)].length) {
            throw new UnprocessableEntityExeception(
                'groupId and registerTimeId are exclusive unique',
            );
        }

        const registerTimetables = await this.timetableSettingRepository.findWithActiveByIds(dtos.map(timetable => timetable.registerTimeId));
        const registerTimetableSettingMap = keyBy(registerTimetables, '_id');

        const currentTimetableOfGroup = await this.timetableRepository.getManyByGroupAndRegisterTime(dtos);
        const currentTimetableOfGroupMap = keyBy(
            currentTimetableOfGroup,
            'groupId',
        );

        dtos.forEach((item, index) => {
            item.registerTime = registerTimetableSettingMap[item.registerTimeId];
            delete item.registerTimeId;

            if (!item.registerTime) {
                throw new UnprocessableEntityExeception(
                    'registerTime in payload is unexisted or deleted',
                );
            }

            // If user has been registered for the timetable_settings --> append to it
            if (currentTimetableOfGroupMap[item.userId]) {
                if (
                    !currentTimetableOfGroupMap[item.userId].activities.includes(
                        item.activityId,
                    )
                ) {
                    currentTimetableOfGroupMap[item.userId].activities.push(
                        item.activityId,
                    );
                }
                dtos[index] = currentTimetableOfGroupMap[item.userId];
            } else {
                dtos[index].activities = [item.activityId];
            }
            delete item.activityId;
        });

        const existedTimeTableIds = (dtos.filter(timetable => timetable._id) || []).map(
            timetable => timetable._id
        );

        await this.timetableRepository.createMany(dtos.filter(timetable => !timetable._id));
        if (existedTimeTableIds.length) {
            await Promise.all(dtos.filter(timetable => timetable._id !== null)?.map(async timetable => {
                await this.timetableRepository.updateById(timetable._id, timetable);
            }));
        }
    }
}

export const TimetableService = new Service();
