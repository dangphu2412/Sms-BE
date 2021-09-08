import '../../config/config-service.config';
import { UserModel } from 'core/modules/user';
import { Role } from 'core/rules';
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker/locale/vi';
import { BcryptService } from 'core/modules/auth/service';
import { sample } from 'lodash';
import { UniversityRepository } from 'core/modules/university/university.repository';

export class UserSeeder {
    static async run() {
        const roles = [Role.LEADER.name, Role.MEMBER.name];
        const universities = await UniversityRepository.find({}, '_id');
        const defaultPwd = BcryptService.hash('Abc123@@');
        const sampleUserData = [];
        for (let i = 1; i <= 100; i += 1) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            sampleUserData.push({
                email: `user${i}@gmail.com`,
                password: defaultPwd,
                createdAt: faker.date.between('2015-01-01', '2017-12-01'),
                updatedAt: faker.date.between('2015-01-01', '2017-12-01'),
                deletedAt: null,
                roles: faker.random.arrayElements(roles, 1),
                profile: {
                    firstName,
                    lastName,
                    fullName: `${firstName} ${lastName}`,
                    birthday: faker.date.between('2015-01-01', '2017-12-01'),
                    phone: faker.phone.phoneNumber(),
                    hometown: faker.address.city(),
                    facebook: 'https://www.facebook.com/',
                    university: sample(universities)
                }
            });
        }
        return UserModel.insertMany(sampleUserData);
    }
}
