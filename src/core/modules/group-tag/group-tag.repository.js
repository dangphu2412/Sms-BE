import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { GroupTagModel } from './group-tag.model';

class Repository extends DataRepository {
    constructor() {
        super(GroupTagModel);
    }

    getByName(name, fields = '') {
        return this.find({ name }, fields);
    }
}

export const GroupTagRepository = new Repository();
