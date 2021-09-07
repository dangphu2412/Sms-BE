// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker/locale/vi';
import { sample } from 'lodash';
import { TIMETABLE_REQUEST_TYPE, TIMETABLE_REQUEST_STATUS } from 'core/common/enum';
import { TimetableSettingRepository } from 'core/modules/timetable-setting';
import { TimetableRepository } from 'core/modules/timetable';
import mongoose from 'mongoose';
import { UserRepository } from 'core/modules/user';
import { TimetableRequestModel } from 'core/modules/timetable-request';

export class TimetableRequestSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const timetableIds = await TimetableRepository.find({}, '_id');
        const timetableSettingIds = await TimetableSettingRepository.find({}, '_id');

        const lateMins = ['late 5 mins', 'late 10 mins', 'late 15 mins', 'late 30 mins'];
        const soonMins = ['soon 5 mins', 'soon 10 mins', 'soon 15 mins', 'soon 30 mins'];

        const reasons = [
            'Bố Thik thì bố nghỉ',
            'Group ko hợp lý tưởng sống, mình cần thời gian để cống hiến cho Đảng',
            'ĐỨC HUY ĐẸP TRAI QUÁ KHIẾN MÌNH KO TẬP TRUNG LÀM TASK ĐC',
            'NHÌN ANH ĐỨC HUY, MÌNH MUỐN THÀNH BÊ ĐÊ NÊN MÌNH SỢ, PHẢI OUT GROUP',
            'ANH PHÚ LÀ BÊ ĐÊ HẢ ?',
            'BẠN TÚ HỞ TÍ LÀ ĐÒI THÔNG ASS MÌNH',
            'Group BE toàn đòi thông ass nhau, mình sợ quá, sợ quá phải out thôi',
            'Chữa trĩ'
        ];

        const sampleTempTimetableData = [];
        for (let i = 0; i <= 29; i += 1) {
            const sampleType = sample(Object.values(TIMETABLE_REQUEST_TYPE));
            const tempTimetable = {
                _id: new mongoose.Types.ObjectId(),
                type: sampleType,
                user: sample(userIds),
                appliedDate: faker.date.between(faker.date.recent(), faker.date.future()),
                timetableId: sampleType !== TIMETABLE_REQUEST_TYPE.OUT ? sample(timetableIds) : null,
                registerTime: sampleType !== TIMETABLE_REQUEST_TYPE.OUT ? sample(timetableSettingIds) : null,
                customStartTime: sampleType !== TIMETABLE_REQUEST_TYPE.SOON ? sample(soonMins) : null,
                customEndTime: sampleType !== TIMETABLE_REQUEST_TYPE.LATE ? sample(lateMins) : null

            };
            sampleTempTimetableData.push(tempTimetable);
        }
        const sampleTimetableRequestData = [];
        for (let i = 0; i < 10; i += 1) {
            const timetableRequests = {
                user: sample(userIds),
                tempTimetables: sampleTempTimetableData.slice(3 * i, 3 * i + 3),
                type: sample(Object.values(TIMETABLE_REQUEST_TYPE)),
                description: sample(reasons),
                attachment: null,
                approvalStatus: sample([...Object.values(TIMETABLE_REQUEST_STATUS)])
            };
            sampleTimetableRequestData.push(timetableRequests);
        }
        await TimetableRequestModel.insertMany(sampleTimetableRequestData);
    }
}
