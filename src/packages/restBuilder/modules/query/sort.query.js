import { SortDirection } from 'packages/restBuilder/enum';

export class SortQuery {
    /**
     * @type {Record<string, (1 | -1)>} sortQuery
     */
    #sortQuery;

    constructor(sortTransformed) {
        this.#sortQuery = SortQuery.toQuery(sortTransformed);
    }

    static toQuery(sortTransformed) {
        const sortQuery = {};

        sortTransformed.forEach(sortItem => {
            sortQuery[sortItem.sort] = sortItem.order;
        });

        return sortQuery;
    }

    /**
     * @access This method to communicate with queryBuilder.
     * Do not call this when you are building Sort query
     * @author dangphu2412
     * @version 1.0
     */
    getQuery() {
        return this.#sortQuery;
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
        this.#sortQuery[sort] = order;
        return this;
    }

    removeSortByKey(key) {
        if (this.#sortQuery[key]) {
            delete this.#sortQuery[key];
        }
        return this;
    }
}
