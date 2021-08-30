import { toPageDataWith } from 'core/utils';
import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { SearchQuery } from 'packages/restBuilder/modules/query';
import { FilterQuery } from 'packages/restBuilder/modules/query/filter.query';
import { GroupTagRepository } from './group-tag.repository';

class Service extends DataPersistenceService {
    constructor() {
        super(GroupTagRepository);
    }

    async findAll(reqTransformed) {
        const data = await this.repository.search(
            new SearchQuery(reqTransformed.content.search),
            reqTransformed.content.main
        );
        return toPageDataWith(data, data.length);
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
