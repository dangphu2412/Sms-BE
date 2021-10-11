import { UnsupportedMethodException } from 'core/infrastructure/exceptions/unsupported-method.exception';
import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { camelCase, upperFirst } from 'lodash';
import { parallel } from 'packages/taskExecution';
import { ArrayUtils } from 'packages/utils/array.util';
import { BUILDER_TYPE } from '../../enum/buildType.enum';
import { QueryBuilder, AggregateBuilder } from '../queryBuilder';

export class DataRepository {
    /**
     * @type {import('mongoose').Model<Document<any, {}>, {}>}
     */
    model;

    constructor(model) {
        this.model = model;
        this.collection = model.collection.collectionName;
        LoggerFactory.globalLogger.info(
            `[${upperFirst(camelCase(model.collection.collectionName))}Repository] is bundling`,
        );
    }

    /**
     * @param {import('../../modules/query/pagination.query').PaginationQuery} pagination
     * @param {import('../../modules/query/filter.query').FilterQuery} filter
     * @param {import('../../modules/query/sort.query').SortQuery} sort
     * @param {import('../../modules/query/search.query').SearchQuery[]} search
     * @param {import('mongoose').PopulateOptions} associates
     * @returns {import('../queryBuilder/queryBuilder').QueryBuilder}
     * @param {import('../../enum/buildType.enum').BUILDER_TYPE} querySelector
     */
    getTemplateQuery(pagination, filter, sort, search, main, associates, querySelector = BUILDER_TYPE.FIND) {
        return QueryBuilder
            .builder()[querySelector](this.model)
            .addFilter(filter)
            .addPagination(pagination)
            .addSearch(search)
            .addSort(sort)
            .setMain(main)
            .setAssociates(associates);
    }

    getAndCount(pagination, filter, sort, search, main, associates) {
        const baseQuery = this.getTemplateQuery(pagination, filter, sort, search, main, associates);

        return parallel([
            baseQuery,
            QueryBuilder.builder(baseQuery)
                .countDocuments(this.model)
                .clearPagination()
        ], task => task.run());
    }

    get(pagination, filter, sort, search, main, associates) {
        return this.getTemplateQuery(pagination, filter, sort, search, main, associates).run();
    }

    getWithFilter(filter, main, associates) {
        return this.getTemplateQuery(null, filter, null, null, main, associates).run();
    }

    getWithSort(sort, main, associates) {
        return this.getTemplateQuery(null, null, sort, null, main, associates).run();
    }

    getOne(filter, search, main, associates) {
        return this.getTemplateQuery(null, filter, null, search, main, associates, BUILDER_TYPE.FIND_ONE).run();
    }

    /**
     *
     * @param {import('../../modules/query/search.query').SearchQuery} searchQuery
     * @param {import('mongoose').PopulateOptions[]} associates
     */
    search(searchQuery, main, associates) {
        return this.getTemplateQuery(null, null, null, searchQuery, main, associates).run();
    }

    /**
    * =======================================================================
    * ==============       Shortcut of model method           ===============
    * =======================================================================
    */

    find(query = {}, fields = '') {
        return this.model.find(query).select(fields).lean();
    }

    findByIds(ids, fields = '') {
        return this.model
            .find({ _id: { $in: ids } }, fields)
            .lean();
    }

    findOne(condition, fields = '') {
        return this.model.findOne(condition, fields).lean();
    }

    findById(id, fields = '') {
        return this.model.findById(id, fields).lean();
    }

    updateById(id, payload) {
        return this.model.findByIdAndUpdate(id, payload, { new: true });
    }

    updateByIds(ids, fields) {
        return this.model.updateMany(
            { _id: { $in: ids } },
            { ...fields }
        );
    }

    async batchUpdate(dtos) {
        if (ArrayUtils.isPresent(dtos)) {
            await this.model.collection.bulkWrite(dtos.map(data => ({
                updateOne: {
                    upsert: true,
                    filter: {
                        _id: data._id
                    },
                    update: {
                        $set: data
                    }
                }
            })));
        }
    }

    softDeleteById(id) {
        if (!this.model.schema.obj.deletedAt) {
            throw new UnsupportedMethodException(
                this.collection,
                'soft delete',
            );
        }
        return this.updateById(id, { deletedAt: new Date() });
    }

    deleteMany(conditions, options = {}) {
        if (this.model.schema.obj.deletedAt) {
            return this.model.updateMany(conditions, { deletedAt: new Date() });
        }
        return this.model.deleteMany(conditions, options);
    }

    async hasRecord(field, value, filter = {}) {
        return await this.model.countDocuments({
            [field]: value,
            ...filter
        }) > 0;
    }

    /**
    * =======================================================================
    * ==================       Aggregate method            ==================
    * =======================================================================
    */

    /**
     *
     * @returns {AggregateBuilder}
     */
    emptyAggregate() {
        return AggregateBuilder.builder(this.model);
    }

    fromAggregate(aggregate) {
        return AggregateBuilder.from(this.model, aggregate);
    }
}
