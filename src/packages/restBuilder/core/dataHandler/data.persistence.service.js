import { merge } from 'lodash';
import { LoggerFactory, TransportFactory, TransportGenerator } from 'packages/logger';
import { FileOutputFormat } from 'packages/logger/format/file.format';
import { FilterQuery } from 'packages/restBuilder/modules/query/filter.query';
import { PaginationQuery } from 'packages/restBuilder/modules/query/pagination.query';
import { SearchQuery } from 'packages/restBuilder/modules/query/search.query';
import { SortQuery } from 'packages/restBuilder/modules/query/sort.query';
import { DataRepository } from './data.repository';
import { documentCleanerVisitor } from './document-cleaner.visitor';

export class DataPersistenceService {
    static logger = LoggerFactory.createByTransports(
        TransportFactory.create(TransportGenerator.File, new FileOutputFormat(DataPersistenceService.name))
    )

    repository;

    constructor(repository) {
        if (!(repository instanceof DataRepository)) {
            throw new Error('Extended class DataPersistenceService should be constructed with a DataRepository instance');
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
     * @param {any} dto
     * @param {() => typeof import('packages/httpException/HttpException').HttpException} exceptionDealingWithDatabaseError
     * @returns
     */
    async createOneSafety(dto, exceptionDealingWithDatabaseError) {
        let createdData;

        try {
            createdData = await this.repository.model.create(dto);
        } catch (e) {
            DataPersistenceService.logger.error(e.message);
            DataPersistenceService.logger.error(e.stack);
            throw exceptionDealingWithDatabaseError();
        }

        return createdData;
    }

    /**
     * @param {any} id
     * @param {Record<any, any>} sourceDocument
     * @param {Record<any, any>} updateDocument
     */
    async patchOne(id, sourceDocument, updateDocument) {
        documentCleanerVisitor(updateDocument);
        const updateDoc = merge(sourceDocument, updateDocument);
        await this.repository.model.updateOne({
            _id: id
        }, updateDoc);
    }

    /**
     * @param {any} id
     * @param {() => typeof import('packages/httpException/HttpException').HttpException} notFoundRecordException
     * @returns
     */
    async softDeleteById(id, notFoundRecordException) {
        let isDeleted;
        try {
            isDeleted = await this.repository.softDeleteById(id);
        } catch (e) {
            DataPersistenceService.logger.error(e.message);
            DataPersistenceService.logger.error(e.stack);
        }
        if (!isDeleted) {
            throw notFoundRecordException();
        }
        return isDeleted;
    }
}
