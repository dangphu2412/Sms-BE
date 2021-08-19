import { FilterFactory } from '../factory/filter.factory';

export class FilterQuery {
    #filterQuery;

    constructor(filterTransformed) {
        this.#filterQuery = FilterQuery.toQuery(filterTransformed);
    }

    static toQuery(filterTransformed) {
        const filterQuery = {};
        filterTransformed.forEach(filter => {
            if (!filterQuery[filter.column]) {
                filterQuery[filter.column] = {};
            }

            filterQuery[filter.column][filter.sign] = filter.value;
        });
        return filterQuery;
    }

    /**
     * @access This method to communicate with queryBuilder.
     * Do not call this when you are building Filter query
     * @author dangphu2412
     * @version 1.0
     * @return {Record<string, Record<string, import('../../enum/filter.enum').FilterSign>>}
     * @example {
     *      firstName: {
     *          $eq: 'fusdeptrai'
     *          $gt: 'o'
     *      }
     * }
     */
    getQuery() {
        return this.#filterQuery;
    }

    /**
     * @access This method provide an flexible way to add custom filter to existed query
     * @author dangphu2412
     * @version 1.0
     */
    addFilter(column, sign, value) {
        FilterFactory.filterValidator.validate([column, sign, value]);
        if (!this.#filterQuery[column]) {
            this.#filterQuery[column] = {};
        }
        this.#filterQuery[column] = {
            [sign]: value
        };
        return this;
    }

    removeFilterByColumn(column) {
        if (this.#filterQuery[column]) {
            delete this.#filterQuery[column];
        }
        return this;
    }

    getValue(col, sign) {
        return this.#filterQuery[col]?.[sign];
    }
}
