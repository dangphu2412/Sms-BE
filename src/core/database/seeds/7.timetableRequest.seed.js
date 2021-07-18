import { sample, sampleSize } from 'lodash';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetableRequest.enum';
import { TempTimetableModel } from 'core/modules/temp_timetables/model/tempTimetableModel';
import { UserRepository } from '../../modules/user/repository/user.repository';
import { TimetableRequestModel } from '../../modules/timetable_request/model/timetableRequestModel';

export class TimetableRequestSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const tempTimetableIds = await TempTimetableModel.find({}, '_id');

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

        const sampleTimetableRequestData = [];
        for (let i = 1; i <= 30; i += 1) {
            const timetableRequests = {
                userId: sample(userIds),
                tempTimetables: sampleSize(tempTimetableIds, sample([3, 4, 5])),
                type: sample(Object.values(TIMETABLE_REQUEST_TYPE)),
                description: sample(reasons),
                attachment: 'ko co',
                isApproved: sample([false, true])
            };
            sampleTimetableRequestData.push(timetableRequests);
        }
        // await TimetableRequestModel.deleteMany();
        await TimetableRequestModel.insertMany(sampleTimetableRequestData);
    }
}
