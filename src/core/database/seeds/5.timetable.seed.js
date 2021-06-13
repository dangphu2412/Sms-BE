<<<<<<< HEAD
import { sample } from 'lodash';
=======
import { sample, sampleSize } from 'lodash';
import { TIMETABLE_TYPE } from 'core/common/enum/timetable.enum';
>>>>>>> 76c7a8b ([SMS-86]build model for form)
import { TimetableModel } from 'core/modules/timetable/model/timetable.model';
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker/locale/vi';
import { UserRepository } from '../../modules/user/repository/user.repository';
import { GroupRepository } from '../../modules/group/repository/group.repository';
import { TimetableSettingRepository } from '../../modules/timetableSetting/repository/timetableSetting.repository';
<<<<<<< HEAD
=======
import { ActivityRepository } from '../../modules/activity/repository/activity.repository';
>>>>>>> 76c7a8b ([SMS-86]build model for form)

export class TimetableSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const groupIds = await GroupRepository.find({}, '_id');
        const registerTimeIds = await TimetableSettingRepository.find({}, '_id');
<<<<<<< HEAD
=======
        const activityIds = await ActivityRepository.find({}, '_id');
>>>>>>> 76c7a8b ([SMS-86]build model for form)

        const sampleTimetableData = [];
        for (let i = 1; i <= 100; i += 1) {
            sampleTimetableData.push(
                {
                    userId: sample(userIds),
                    groupId: sample(groupIds),
<<<<<<< HEAD
                    registerTime: sample(registerTimeIds),
                    startDate: faker.date.past(),
                    endDate: faker.date.future(),
=======
                    type: sample([TIMETABLE_TYPE.TEMP, TIMETABLE_TYPE.PERMANENT]),
                    registerTime: sample(registerTimeIds),
                    activities: sampleSize(activityIds, sample([1, 2, 3, 4])),
                    startDate: faker.date.past(),
                    endDate: faker.date.future(),
                    isApproved: sample([false, true]),
                    isActive: sample([false, true]),
>>>>>>> 76c7a8b ([SMS-86]build model for form)
                }
            );
        }
        await TimetableModel.deleteMany();
        await TimetableModel.insertMany(sampleTimetableData);
    }
}
