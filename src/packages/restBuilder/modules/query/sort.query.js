import { SortDirection } from 'packages/restBuilder/enum';

/**
 * @typedef SortFormat
 * @property {string} sort
 * @property {SortDirection} order
 */

export class SortQuery {
    /**
     * @type {SortFormat[]} rawSorts
     */
    #rawSorts;

    constructor(sortTransformed) {
        this.#rawSorts = sortTransformed;
    }

    /**
     * @access This method to communicate with queryBuilder.
     * Do not call this when you are building Sort query
     * @author dangphu2412
     * @version 1.0
     */
    generate() {
        const sortQuery = {};

        this.#rawSorts.forEach(sortItem => {
            sortQuery[sortItem.sort] = sortItem.order;
        });

        return sortQuery;
    }

    /**
     * @access This method provide an flexible way to add custom sort to existed query
     * @author dangphu2412
     * @version 1.0
     * @param {string} sort
     * @param {SortDirection} order
     */
    addSort(sort, order) {
        if (!SortDirection[order]) {
            throw new Error(`Invalid order added into addSort method from class ${SortQuery.name}`);
        }
        this.#rawSorts.push({
            sort,
            order
        });
        return this;
    }
}
