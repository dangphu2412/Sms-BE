import { sample } from 'lodash';
import { TimetableModel } from 'core/modules/timetable/model/timetable.model';
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker/locale/vi';
import { UserRepository } from '../../modules/user/repository/user.repository';
import { GroupRepository } from '../../modules/group/repository/group.repository';
import { TimetableSettingRepository } from '../../modules/timetableSetting/repository/timetableSetting.repository';

export class TimetableSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const groupIds = await GroupRepository.find({}, '_id');
        const registerTime = await TimetableSettingRepository.find({});

        const sampleTimetableData = [];
        for (let i = 1; i <= 100; i += 1) {
            sampleTimetableData.push(
                {
                    userId: sample(userIds),
                    groupId: sample(groupIds),
                    registerTime: sample(registerTime),
                    startDate: faker.date.past(),
                    endDate: faker.date.future(),
                }
            );
        }
        await TimetableModel.deleteMany();
        await TimetableModel.insertMany(sampleTimetableData);
    }
}
