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
  async createOrUpdateMany(dtos) {
    const activityIds = [];
    const registerTimeIds = [];

    dtos.forEach(dto => {
      activityIds.push(dto.activityId);
      registerTimeIds.push(dto.registerTimeId);
    });

    const activityIdSet = [...new Set(activityIds)];
    const registerTimeIdSet = [...new Set(registerTimeIds)];

    const activities = await this.activityRepository
        .findWithActiveByIds(activityIds, '_id deletedAt');

    if (activityIdSet.length !== activities.length) {
      throw new UnprocessableEntityExeception('activity in payload is unexisted or deleted');
    }

    const registerTimetables = await this.timetableSettingRepository
        .findWithActiveByIds(registerTimeIdSet);

    const registerTimetableSettingMap = keyBy(registerTimetables, '_id');

    const currentTimetableOfUser = await this.timetableRepository
        .getManyByUserAndRegisterTime(dtos);

    const currentTimetableOfUserMap = keyBy(currentTimetableOfUser, '_id');

    dtos.forEach((item, index) => {
      item.registerTime = registerTimetableSettingMap[item.registerTimeId];

      delete item.registerTimeId;

      if (!item.registerTime) {
        throw new UnprocessableEntityExeception('registerTime in payload is unexisted or deleted');
      }

      // If user has been registered for the timetable_settings --> append to it
      if (currentTimetableOfUserMap[item.userId]) {
        if (!currentTimetableOfUserMap[item.userId].activities.includes(item.activityId)) {
          currentTimetableOfUserMap[item.userId].activities.push(item.activityId);
        }
        dtos[index] = currentTimetableOfUserMap[item.userId];
      } else {
        dtos[index].activities = [item.activityId];
      }
      delete item.activityId;
    });

    return this.timetableRepository.createMany(dtos);
  }
}

export const TimetableService = new Service();
