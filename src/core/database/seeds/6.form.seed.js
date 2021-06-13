import { sample, sampleSize } from 'lodash';
import { UserRepository } from '../../modules/user/repository/user.repository';
import { TimetableRepository } from '../../modules/timetable/repository/timetable.repository';
import { FormModel } from '../../modules/form/model/formModel';

export class FormSeed {
    static async run() {
        const userIds = await UserRepository.find({}, '_id');
        const timetableIds = await TimetableRepository.find({}, '_id');

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

        const sampleFormData = [];
        for (let i = 1; i <= 30; i += 1) {
            const form = {
                userId: sample(userIds),
                type: sample(['nghỉ', 'trễ', 'vắng']),
                reason: sample(reasons),
                isApproved: sample([false, true]),
                attachment: 'ko co',
                timetables: sampleSize(timetableIds, sample([3, 4, 5]))
            };
            sampleFormData.push(form);
        }
        await FormModel.deleteMany();
        await FormModel.insertMany(sampleFormData);
    }
}