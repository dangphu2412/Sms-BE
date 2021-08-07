import { UnsupportedMethodException } from 'core/infrastructure/exceptions/unsupported-method.exception';
import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { camelCase, upperFirst } from 'lodash';
import { parallel } from 'packages/taskExecution';
import { BUILDER_TYPE } from '../../enum/buildType.enum';
import { QueryBuilder } from '../queryBuilder/queryBuilder';

export class DataRepository {
    /**
     * @type {import('mongoose').Model)}
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
                .countDocuments()
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

    find(query = {}, fields = []) {
        return this.model.find(query).select(fields).exec();
    }

    findByIds(ids, fields = []) {
        return this.model
            .find({ _id: { $in: ids } })
            .select(fields)
            .exec();
    }

    findOne(condition, fields = []) {
        return this.model.findOne(condition, fields).exec();
    }

    findById(id, fields = []) {
        return this.model.findById(id, fields).exec();
    }

    updateById(id, payload) {
        return this.model.findByIdAndUpdate(id, payload, { new: true });
    }

    softDeleteById(id) {
        if (!this.model.deletedAt) {
            throw new UnsupportedMethodException(
                this.collection,
                'soft delete',
            );
        }
        return this.updateById(id, { deletedAt: new Date() });
    }

    deleteMany(conditions, options = {}) {
        if (this.model.deletedAt) {
            return this.model.updateMany(conditions, { deletedAt: new Date() });
        }
        return this.model.deleteMany(conditions, options);
    }

    hasRecord(field, value, filter = {}) {
        return this.model.countDocuments({
            [field]: value,
            ...filter
        });
    }
}
