import { UserModel } from 'core/modules/user/model/userModel';
import { BcryptService } from '../../utils';

export class UserSeeder {
    static async run() {
        const profile = {
            firstName: 'Dang',
            lastName: 'Phu',
            birthday: Date.now(),
            phone: '09032132132',
            hometown: 'Da Nang',
            facebook: 'https://www.facebook.com/',
        };

        const defaultPwd = BcryptService.hash('Abc123@@');
        const sampleUserData = [];
        for (let i = 1; i <= 20; i += 1) {
            sampleUserData.push({
                email: `user${i}@gmail.com`,
                password: defaultPwd,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                profile
            });
        }
        await UserModel.deleteMany();
        await UserModel.insertMany(sampleUserData);
    }
}
