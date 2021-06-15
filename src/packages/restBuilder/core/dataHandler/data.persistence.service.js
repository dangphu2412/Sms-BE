import { Optional } from 'core/utils/optional';
import { DuplicateException } from 'packages/httpException';
import { FilterQuery } from 'packages/restBuilder/modules/query/filter.query';
import { PaginationQuery } from 'packages/restBuilder/modules/query/pagination.query';
import { SearchQuery } from 'packages/restBuilder/modules/query/search.query';
import { SortQuery } from 'packages/restBuilder/modules/query/sort.query';
import { DataRepository } from './data.repository';

export class DataPersistenceService {
    /**
     * @type {import('./data.repository').DataRepository}
     */
    repository;

    constructor(repository) {
        if (!(repository instanceof DataRepository)) {
            throw new Error('Extended class DataPersistenceService should be constructed with DataRepository instance');
        }
        this.repository = repository;
    }

    /**
     * 
     * @param {import('../requestTransformer/RequestTransformer').RequestTransformer} requestTransformer 
     */
    getAndCount(requestTransformer) {
        return this.repository.getAndCount(
            new PaginationQuery(requestTransformer.content.pagination),
            new FilterQuery(requestTransformer.content.filters),
            new SortQuery(requestTransformer.content.sorts),
            new SearchQuery(requestTransformer.content.search),
            requestTransformer.content.main,
            requestTransformer.content.associates
        );
    }

    get(requestTransformer) {
        return this.repository.get(
            new PaginationQuery(requestTransformer.content.pagination),
            new FilterQuery(requestTransformer.content.filters),
            new SortQuery(requestTransformer.content.sorts),
            new SearchQuery(requestTransformer.content.search),
            requestTransformer.content.main,
            requestTransformer.content.associates
        );
    }

    getOne(requestTransformer) {
        return this.repository.getOne(
            new FilterQuery(requestTransformer.content.filters),
            new SearchQuery(requestTransformer.content.search),
            requestTransformer.content.main,
            requestTransformer.content.associates
        );
    }

    /**
     * @param {*} dto 
     * @param {{column, sign, value, err}} uniqueCondition 
     * @param {*} validator 
     * @returns 
     */
    async create(
        dto,
        uniqueCondition,
        validator
    ) {
        let newRecord;

        if (uniqueCondition) {
            const {
                column, sign, value, err
            } = uniqueCondition;
            Optional
                .of(await this.repository.getOne(
                    new FilterQuery([{
                        [column]: {
                            [sign]: value
                        }
                    }])
                ))
                .throwIfPresent(new DuplicateException(err));
        }

        if (validator) {
            await validator.validate();
        }

        try {
            newRecord = await this.repository.model.create(dto);
        } catch (error) {
            DataPersistenceService.logger.error(error.message);
        }
        return { _id: newRecord._id };
    }
}
