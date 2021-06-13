import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { UserModel } from '../model/userModel';

class Repository extends DataRepository {
    constructor() {
        super(UserModel);
    }

    /**
   *
   * @param email
   * @returns {Promise<UserModel | null>}
   */
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
