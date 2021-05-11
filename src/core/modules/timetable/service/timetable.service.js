import keyBy from 'lodash/keyBy';
import { TimetableRepository } from '../repository';
import { TimetableSettingRepository } from '../../timetableSetting/repository';

class Service {
  constructor() {
    this.timetableRepository = TimetableRepository;
    this.timetableSettingRepository = TimetableSettingRepository;
  }

  /**
   * Function to create many timetable records
   * @param {Array<TimeTable>} payload
   * @returns
   */
  async createOrUpdateMany(payload) {
    const currentTimetableOfUser = await this.getTimeTableOfUsers(payload);
    payload.forEach((item, index) => {
      const settingId = item.userId;
      // If user has been registered for the timetable_settings --> append to it
      if (currentTimetableOfUser[settingId]) {
        if (!currentTimetableOfUser[settingId].activities.includes(item.activityId)) {
          currentTimetableOfUser[settingId].activities.push(item.activityId);
        }
        payload[index] = currentTimetableOfUser[settingId];
      } else {
        payload[index].activities = [item.activityId];
      }
      delete item.activityId;
    });
    return this.timetableRepository.create(payload, { upsert: true });
  }

  /**
   * Get current timetable of users according to setting
   * @param {*} userIds
   * @param {*} timetableSetttingId
   * @returns {Object<Key, Value>} :Key is userId, value is currentTimetable of user
   */
  async getTimeTableOfUsers(payload) {
    const conditions = payload.map(item => ({
      userId: item.userId,
      registerTimeId: item.registerTime._id
    }));

    const data = await this.timetableRepository.getManyByUserAndRegisterTime(conditions);
    return keyBy(data, 'userId');
  }
}

export const TimetableService = new Service();
