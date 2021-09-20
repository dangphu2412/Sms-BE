import { isEmpty } from 'lodash';
import { FilterQuery } from 'packages/restBuilder/modules/query/filter.query';
import { PaginationQuery } from 'packages/restBuilder/modules/query/pagination.query';
import { SearchQuery } from 'packages/restBuilder/modules/query/search.query';
import { SortQuery } from 'packages/restBuilder/modules/query/sort.query';
import { StateManagement } from 'packages/restBuilder/modules/state-management';

export class AggregateBuilder {
    static SELECT_FIELD_SIGNAL = 1;

    /**
     * @type {import('../../modules/state-management').StateManagement}
     */
    #stateManagement

    #limit;

    #offset;

    #filterDocument = {};

    #sortDocument = {};

    #selectedFields = null;

    #searchDocument = {};

    /**
     * @type {import('mongoose').PopulateOptions[]}
     */
    #associates = []

    /**
     * @type {import('mongoose').Aggregate}
     */
    #builder;

    /**
     *
     * @param {import('mongoose').Model=} mongooseModel
     * @returns {AggregateBuilder}
     */
    static builder(mongooseModel) {
        const newInstance = new AggregateBuilder();

        if (mongooseModel) {
            newInstance.#builder = mongooseModel.aggregate();
            newInstance.#stateManagement = new StateManagement();
        }

        return newInstance;
    }

    /**
     *
     * @param {import('mongoose').Model=} mongooseModel
     * @param {AggregateBuilder} builder
     * @returns
     */
    static from(mongooseModel, builder) {
        const newInstance = new AggregateBuilder();
        const queryDocument = builder.getQueryDocument();
        newInstance.#builder = mongooseModel.aggregate(builder.getPipeline());

        newInstance.#filterDocument = queryDocument.filterDocument;
        newInstance.#sortDocument = queryDocument.sortDocument;
        newInstance.#searchDocument = queryDocument.searchDocument;
        newInstance.#limit = queryDocument.limit;
        newInstance.#offset = queryDocument.offset;
        newInstance.#stateManagement = queryDocument.stateManagement;

        return newInstance;
    }

    getBuilder() {
        return this.#builder;
    }

    getPipeline() {
        return this.#builder.pipeline();
    }

    getQueryDocument() {
        return {
            limit: this.#limit,
            offset: this.#offset,
            filterDocument: this.#filterDocument,
            sortDocument: this.#sortDocument,
            searchDocument: this.#searchDocument,
            stateManagement: this.#stateManagement
        };
    }

    /**
     * @description
     * - lazySet = true -> builder will not project the fields
     * so that we need to call project() after setSelectedFields()
     * @param {*} fields
     * @param {*} lazySet
     * @returns
     */
    setSelectedFields(fields, lazySet = false) {
        if (!isEmpty(fields)) {
            this.#selectedFields = fields;

            if (!lazySet) {
                this.project();
                this.#stateManagement.lock(StateManagement.STATE_KEY.FIELD);
            }
        }
        return this;
    }

    /**
     * @param {import('mongoose').PopulateOptions[]} associates
     */
    setAssociates(associates) {
        if (Array.isArray(associates) && !isEmpty(associates)) {
            this.#associates = associates;

            if (!isEmpty(this.#associates)) {
                this.#associates.forEach(associate => {
                    this.#builder.lookup(associate);
                });
            }
        }
        return this;
    }

    /**
     *
     * @param {string} field
     * @param {string=} value
     * @returns {this}
     */
    addField(field, value = AggregateBuilder.SELECT_FIELD_SIGNAL) {
        this.#selectedFields[`${field}`] = value;
        return this;
    }

    /**
     * @param {import('mongoose').PopulateOptions} associate
     */
    addAssociate(associate) {
        this.#builder.lookup(associate);
        return this;
    }

    /**
     * @param {number} offset
     */
    addOffset(offset) {
        this.#offset = offset;
        if (this.#offset) {
            if (Number.isNaN(this.#offset)) {
                throw new Error('Offset is set into query builder is not a number');
            }
            this.#builder.skip(this.#offset);
        }
        return this;
    }

    /**
     * @param {number} limit
     */
    addLimit(limit) {
        this.#limit = limit;
        if (this.#limit) {
            if (Number.isNaN(this.#limit)) {
                throw new Error('Limit is set into query builder is not a number');
            }
            this.#builder.limit(this.#limit);
        }
        return this;
    }

    /**
     * @implements Must skip before limit
     * @param {number} offset
     * @param {number} limit
     * @returns {this}
     */
    addOffsetAndLimit(offset, limit) {
        this.#offset = offset;
        this.#limit = limit;

        /**
         * @note: Not verify state of added limit & offset
         */

        if (this.#offset) {
            if (Number.isNaN(this.#offset)) {
                throw new Error('Offset is set into query builder is not a number');
            }
            this.#builder.skip(this.#offset);
        }

        if (this.#limit) {
            if (Number.isNaN(this.#limit)) {
                throw new Error('Limit is set into query builder is not a number');
            }
            this.#builder.limit(this.#limit);
        }

        return this;
    }

    /**
     * @param {typeof import('../../modules/query/pagination.query').PaginationQuery} pagination
     * @returns {this}
     */
    addPagination(pagination) {
        if (!(pagination instanceof PaginationQuery)) {
            throw new Error(`Call method addPagination of QueryBuilder with param is not an instance of ${PaginationQuery.name}`);
        }

        this.addOffsetAndLimit(pagination.offset, pagination.limit);

        return this;
    }

    /**
     * @param {typeof import('../../modules/query/filter.query').FilterQuery} filter
     * @returns {this}
     */
    addFilter(filter) {
        if (filter) {
            if (!(filter instanceof FilterQuery)) {
                throw new Error(`Call method addFilter of QueryBuilder with param is not an instance of ${FilterQuery.name}`);
            }
            this.#filterDocument = filter.getQuery();
            if (!isEmpty(this.#filterDocument)) {
                this.#builder.match(this.#filterDocument);
            }
        }

        return this;
    }

    /**
     * @param {typeof import('../../modules/query/search.query').SearchQuery} search
     * @returns {this}
     */
    addSearch(search) {
        if (!search) {
            throw new Error('Can not add search with empty value');
        }

        if (search instanceof SearchQuery) {
            this.#searchDocument = search.getQuery().value;
        } else {
            this.#searchDocument = search;
        }

        if (!isEmpty(this.#searchDocument)) {
            if (!isEmpty(this.getPipeline())) {
                throw new Error('AggregateBuilder#addSearch(search) should be call first because aggregate only support search as the first parameter in pipeline');
            }
            this.#builder.match({
                $text: {
                    $search: this.#searchDocument
                }
            });
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
            if (!isEmpty(this.#sortDocument)) {
                this.#builder.sort(this.#sortDocument);
            }
        }
        return this;
    }

    /**
     *
     * @param {string} countKey
     * @returns {this}
     */
    addCount(countKey) {
        this.#builder.count(countKey);
        return this;
    }

    addUnwind(unwindKey) {
        this.#builder.unwind(`$${unwindKey}`);
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

    project() {
        if (this.#stateManagement.isLocked(StateManagement.STATE_KEY.FIELD)) {
            throw new Error('Project has been called. If you want to add more fields after call #setSelectedFields please use lazySet = true');
        }
        this.#builder.project(this.#selectedFields);
        return this;
    }

    run() {
        return this.#builder.exec();
    }
}
