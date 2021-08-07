import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { UserModel } from './model/user.model';

class Repository extends DataRepository {
    constructor() {
        super(UserModel);
    }

    getAvailableByEmail(email) {
        return this.findOne({ email, deletedAt: null });
    }

    getByEmail(email) {
        return this.findOne({ email });
    }

    getDetailById(id) {
        return this.model.findById(id,
            ['_id', 'email', 'profile', 'status'],
            { timestamps: true });
    }

    getAvailableByEmails(emails) {
        return this.model.find({ email: { $in: emails } }, 'email');
    }
}

export const UserRepository = new Repository();
