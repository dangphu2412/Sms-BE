import '../../config/config-service.config';
import { UserModel } from 'core/modules/user/model/user.model';
import { Types } from 'mongoose';
import { BcryptService } from 'core/modules/auth/service/bcrypt.service';
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
