import { sample } from 'lodash';
import { TimetableModel } from 'core/modules/timetable';
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker/locale/vi';
import { UserRepository } from 'core/modules/user/user.repository';
import { GroupRepository } from 'core/modules/group/group.repository';
import { TimetableSettingRepository } from 'core/modules/timetable-setting/timetable-setting.repository';
import { ActivityRepository } from 'core/modules/activity/activity.repository';

export class TimetableSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const groupIds = await GroupRepository.find({}, '_id');
        const registerTime = await TimetableSettingRepository.find();
        const activities = await ActivityRepository.find();

        const sampleTimetableData = [];
        for (let i = 1; i <= 100; i += 1) {
            sampleTimetableData.push(
                {
                    user: sample(userIds),
                    group: sample(groupIds),
                    registerTime: sample(registerTime),
                    activities: [sample(activities)._id],
                    startDate: faker.date.past(),
                    endDate: faker.date.future(),
                }
            );
        }
        await TimetableModel.insertMany(sampleTimetableData);
    }
}
