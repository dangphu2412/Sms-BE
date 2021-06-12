import { UserModel } from 'core/modules/user/model/userModel';
import { Role } from 'core/rules';
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import { BcryptService } from '../../utils';

export class UserSeeder {
    static async run() {
        const profile = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            birthday: faker.date.past(2000),
            phone: faker.phone.phoneNumber(),
            hometown: faker.address.city(),
            facebook: 'https://www.facebook.com/',
        };
        const roles = [Role.ADMIN.name, Role.MEMBER.name];

        const defaultPwd = BcryptService.hash('Abc123@@');
        const sampleUserData = [];
        for (let i = 1; i <= 20; i += 1) {
            sampleUserData.push({
                email: `user${i}@gmail.com`,
                password: defaultPwd,
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
                deletedAt: null,
                roles: faker.random.arrayElements(roles, 1),
                profile
            });
        }
        await UserModel.deleteMany();
        return UserModel.insertMany(sampleUserData);
    }
}
