import '../../config/config-service.config';
import { Types } from 'mongoose';
import { BcryptService } from 'core/modules/auth/service';
import { UserModel } from 'core/modules/user';
import sgroupInitialUser from '../data/migration/initialUser.json';

export class CreateUserWithHighestPriority {
    static run() {
        const defaultPwd = BcryptService.hash('Sgroup123@@');
        return UserModel.insertMany(sgroupInitialUser.map(user => new UserModel({
            ...user,
            password: defaultPwd,
            _id: Types.ObjectId(user._id)
        })));
    }
}
