import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { GroupTagModel } from './group-tag.model';

class Repository extends DataRepository {
    constructor() {
        super(GroupTagModel);
    }
}

export const GroupTagRepository = new Repository();
