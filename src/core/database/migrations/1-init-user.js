import { Role } from 'core/common/enum';
import { UserModel } from 'core/modules/user/model/userModel';
import { BcryptService } from 'core/utils';

export class CreateUserWithHighestPriority {
    static run() {
        const profile = {
            firstName: 'Dang',
            lastName: 'Phu',
            birthday: Date.now(),
            phone: '09032132132',
            hometown: 'Da Nang',
            facebook: 'https://www.facebook.com/',
        };

        const defaultPwd = BcryptService.hash('Phuprocute123@@');
        return UserModel.create(
            new UserModel(
                {
                    email: 'dangphu241299@gmail.com',
                    password: defaultPwd,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                    profile,
                    roles: [Role.ADMIN, Role.LEADER]
                }
            )
        );
    }
}
