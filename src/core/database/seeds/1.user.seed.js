import { UserModel } from 'core/modules/user/model/userModel';
import { Role } from 'core/rules';
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker/locale/vi';
import { BcryptService } from '../../utils';

export class UserSeeder {
    static async run() {
        const roles = [Role.LEADER.name, Role.MEMBER.name];

        const defaultPwd = BcryptService.hash('Abc123@@');
        const sampleUserData = [];
        for (let i = 1; i <= 100; i += 1) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            sampleUserData.push({
                email: `user${i}@gmail.com`,
                password: defaultPwd,
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
                deletedAt: null,
                roles: faker.random.arrayElements(roles, 1),
                profile: {
                    firstName,
                    lastName,
                    fullName: `${firstName} ${lastName}`,
                    birthday: faker.date.between('01-01-1995', '01-01-2003'),
                    phone: faker.phone.phoneNumber(),
                    hometown: faker.address.city(),
                    facebook: 'https://www.facebook.com/',
                }
            });
        }
        return UserModel.insertMany(sampleUserData);
    }
}
