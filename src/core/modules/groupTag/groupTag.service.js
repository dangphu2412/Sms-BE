import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { FilterQuery } from 'packages/restBuilder/modules/query/filter.query';
import { GroupTagRepository } from './groupTag.repository';

class Service extends DataPersistenceService {
    constructor() {
        super(GroupTagRepository);
    }

    findAllWithGroups(reqTransformed) {
        return this.repository.getWithFilter(
            new FilterQuery(reqTransformed.content.filters),
            reqTransformed.content.main,
            reqTransformed.content.associates
        );
    }
}

export const GroupTagService = new Service();
