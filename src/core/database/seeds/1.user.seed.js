import { UserModel } from 'core/modules/user/model/userModel';
// eslint-disable-next-line import/no-extraneous-dependencies
import fakerVi from 'faker/locale/vi';
import { BcryptService } from '../../utils';

export class UserSeeder {
    static async run() {
        const defaultPwd = BcryptService.hash('Abc123@@');
        const sampleUserData = [];
        sampleUserData.push({
            email: 'phus@gmail.com',
            password: defaultPwd,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            profile: {
                firstName: 'Dang',
                lastName: 'Phu',
                birthday: new Date('01-01-1999'),
                phone: '09032132132',
                hometown: 'Da Nang',
                facebook: 'https://www.facebook.com/',
            }
        });

        for (let i = 1; i <= 200; i += 1) {
            const profile = {
                firstName: fakerVi.name.firstName(),
                lastName: fakerVi.name.lastName(),
                birthday: fakerVi.date.between('01-01-1995', '01-01-2003'),
                phone: fakerVi.phone.phoneNumber('##########'),
                hometown: fakerVi.address.cityName(),
                facebook: 'https://www.facebook.com/',
            };
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
