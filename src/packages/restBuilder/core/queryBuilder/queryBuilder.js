import { BUILDER_TYPE } from 'packages/restBuilder/enum/buildType.enum';
import { FilterQuery } from 'packages/restBuilder/modules/query/filter.query';
import { PaginationQuery } from 'packages/restBuilder/modules/query/pagination.query';
import { SearchQuery } from 'packages/restBuilder/modules/query/search.query';
import { SortQuery } from 'packages/restBuilder/modules/query/sort.query';

export class QueryBuilder {
    #buildType;

    #limit;

    #offset;

    #filterDocument = {};

    #sortDocument = {};

    #main;

    #searchDocument = {};

    /**
     * @type {import('mongoose').PopulateOptions[]}
     */
    #associates = []

    /**
     * @type {import('mongoose').Query}
     */
    #builder;

    /**
     * @param {QueryBuilder=} queryBuilder
     * @returns
     */
    static builder(queryBuilder) {
        const newInstance = new QueryBuilder();
        if (queryBuilder) {
            const queryDocument = queryBuilder.getQueryDocument();
            newInstance.#filterDocument = queryDocument.filterDocument;
            newInstance.#sortDocument = queryDocument.sortDocument;
            newInstance.#searchDocument = queryDocument.searchDocument;
            newInstance.#limit = queryDocument.limit;
            newInstance.#offset = queryDocument.offset;
        }
        return {
            find: newInstance.#init(BUILDER_TYPE.FIND),
            findOne: newInstance.#init(BUILDER_TYPE.FIND_ONE),
            countDocuments: newInstance.#init(BUILDER_TYPE.COUNT)
        };
    }

    #init = buildType => model => {
        this.#builder = model[buildType]();
        this.#buildType = buildType;
        return this;
    }

    getBuilder() {
        return this.#builder;
    }

    getQueryDocument() {
        return {
            limit: this.#limit,
            offset: this.#offset,
            filterDocument: this.#filterDocument,
            sortDocument: this.#sortDocument,
            searchDocument: this.#searchDocument,
        };
    }

    setMain(main) {
        this.#main = main;
        return this;
    }

    /**
     * @param {import('mongoose').PopulateOptions[]} associates
     */
    setAssociates(associates) {
        if (Array.isArray(associates) && associates.length > 0) {
            this.#associates = associates;
        }
        return this;
    }

    /**
     * @param {import('mongoose').PopulateOptions} associate
     */
    addPopulate(associate) {
        this.#associates.push(associate);
        return this;
    }

    /**
     * @param {number} offset
     */
    addOffset(offset) {
        this.#offset = offset;
        return this;
    }

    /**
     * @param {number} limit
     */
    addLimit(limit) {
        this.#limit = limit;
        return this;
    }

    /**
     * @param {number} offset
     * @param {number} limit
     */
    addOffsetAndLimit(offset, limit) {
        this.#offset = offset;
        this.#limit = limit;
        return this;
    }

    /**
     * @param {typeof import('../../modules/query/pagination.query').PaginationQuery} pagination
     */
    addPagination(pagination) {
        if (pagination) {
            if (!(pagination instanceof PaginationQuery)) {
                throw new Error(`Call method addPagination of QueryBuilder with param is not an instance of ${PaginationQuery.name}`);
            }
            this.#limit = pagination.limit;
            this.#offset = pagination.offset;
        }

        return this;
    }

    /**
     * @param {typeof import('../../modules/query/filter.query').FilterQuery} filter
     */
    addFilter(filter) {
        if (filter) {
            if (!(filter instanceof FilterQuery)) {
                throw new Error(`Call method addFilter of QueryBuilder with param is not an instance of ${FilterQuery.name}`);
            }
            this.#filterDocument = filter.getQuery();
        }

        return this;
    }

    /**
     * @param {typeof import('../../modules/query/search.query').SearchQuery} search
     */
    addSearch(search) {
        if (search) {
            if (!(search instanceof SearchQuery)) {
                throw new Error(`Call method addSearch of QueryBuilder with param is not an instance of ${SearchQuery.name}`);
            }
            this.#searchDocument = search.getQuery();
        }
        return this;
    }

    /**
     * @param {typeof import('../../modules/query/sort.query').SortQuery} sort
     */
    addSort(sort) {
        if (sort) {
            if (!(sort instanceof SortQuery)) {
                throw new Error(`Call method addSort of QueryBuilder with param is not an instance of ${SortQuery.name}`);
            }
            this.#sortDocument = sort.getQuery();
        }
        return this;
    }

    clearPagination() {
        this.#limit = null;
        this.#offset = null;
        return this;
    }

    clearOffset() {
        this.#offset = null;
        return this;
    }

    clearLimit() {
        this.#limit = null;
        return this;
    }

    clearFilters() {
        this.#filterDocument = {};
        return this;
    }

    removeFilter(column) {
        if (this.#filterDocument[column]) {
            delete this.#filterDocument[column];
        }
        return this;
    }

    removeSort(sort) {
        if (this.#sortDocument[sort]) {
            delete this.#filterDocument[sort];
        }
        return this;
    }

    run() {
        if (this.#limit) {
            if (Number.isNaN(this.#limit)) {
                throw new Error('Limit is set into query builder is not a number');
            }
            this.#builder.limit(this.#limit);
        }
        if (this.#offset) {
            if (Number.isNaN(this.#offset)) {
                throw new Error('Offset is set into query builder is not a number');
            }
            this.#builder.skip(this.#offset);
        }
        this.#builder[this.#buildType](this.#filterDocument);
        if (this.#searchDocument) {
            this.#builder[this.#buildType](this.#searchDocument);
        }

        if (this.#associates.length > 0) {
            this.#associates.forEach(associate => {
                this.#builder.populate(associate);
            });
        }
        this.#builder.sort(this.#sortDocument);
        this.#builder.select(this.#main);
        this.#builder.lean({ virtuals: true });
        return this.#builder.exec();
    }
}
