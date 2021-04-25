import { RepositoryBase } from '../../../infrastructure/repositoryBase';
import { UserModel } from '../model/userModel';

class Repository extends RepositoryBase {
    constructor() {
        super(UserModel);
    }

    findOneByEmail(email, fields = []) {
        return this.model.findOne({ email }).select(fields);
    }
}

export const UserRepository = new Repository();
