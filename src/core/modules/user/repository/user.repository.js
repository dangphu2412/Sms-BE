import { RepositoryBase } from '../../../infrastructure/repositoryBase';
import { UserModel } from '../model/userModel';

class Repository extends RepositoryBase {
    constructor() {
        super(UserModel);
    }

    findOne(filter, fields = ['*']) {
        return this.model.findOne(filter).select(fields);
    }
}

export const UserRepository = new Repository();
