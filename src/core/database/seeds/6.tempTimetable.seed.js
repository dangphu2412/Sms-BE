/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker/locale/vi';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetableRequest.enum';
import { TimetableRepository } from 'core/modules/timetable/repository';
import { TimetableSettingRepository } from 'core/modules/timetableSetting/repository';
import { sample } from 'lodash';
import { TempTimetableModel } from 'core/modules/temp_timetables/model/tempTimetableModel';
import { UserRepository } from '../../modules/user/repository/user.repository';

export class TempTimetableSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const timetableIds = await TimetableRepository.find({}, '_id');
        const timetableSettingIds = await TimetableSettingRepository.find({}, '_id');
        const lateMins = ['late 5 mins', 'late 10 mins', 'late 15 mins', 'late 30 mins'];
        const soonMins = ['soon 5 mins', 'soon 10 mins', 'soon 15 mins', 'soon 30 mins'];

        const sampleTempTimetableData = [];
        for (let i = 0; i <= 32; i += 1) {
            const sampleType = sample(Object.values(TIMETABLE_REQUEST_TYPE));
            const tempTimetable = {
                type: sampleType,
                userId: sample(userIds),
                appliedDate: faker.date.between(faker.date.recent(), faker.date.future()),
                ...(sampleType !== TIMETABLE_REQUEST_TYPE.OUT) ? { timetableId: sample(timetableIds) } : { timetableId: null },
                ...(sampleType !== TIMETABLE_REQUEST_TYPE.OUT) ? { registerTime: sample(timetableSettingIds) } : { registerTime: null },
                ...(sampleType === TIMETABLE_REQUEST_TYPE.SOON) ? { customStartTime: sample(soonMins) } : { customStartTime: null },
                ...(sampleType === TIMETABLE_REQUEST_TYPE.LATE) ? { customEndTime: sample(lateMins) } : { customEndTime: null },

            };
            sampleTempTimetableData.push(tempTimetable);
        }
        await TempTimetableModel.insertMany(sampleTempTimetableData);
    }
}
