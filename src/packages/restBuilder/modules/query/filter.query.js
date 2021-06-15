import { FilterFactory } from '../factory/filter.factory';

export class FilterQuery {
    #rawFilters;

    constructor(filterTransformed) {
        this.#rawFilters = filterTransformed;
    }

    /**
     * @access This method to communicate with queryBuilder.
     * Do not call this when you are building Filter query
     * @author dangphu2412
     * @version 1.0
     */
    generate() {
        const filterQuery = {};
        this.#rawFilters.forEach(filter => {
            if (!filterQuery[filter.column]) {
                filterQuery[filter.column] = {};
            }

            filterQuery[filter.column][filter.sign] = filter.value;
        });
        return filterQuery;
    }

    /**
     * @access This method provide an flexible way to add custom filter to existed query
     * @author dangphu2412
     * @version 1.0
     */
    addFilter(column, sign, value) {
        FilterFactory.filterValidator.validate([column, sign, value]);
        this.#rawFilters.push({
            column,
            sign,
            value
        });
        return this;
    }
}
