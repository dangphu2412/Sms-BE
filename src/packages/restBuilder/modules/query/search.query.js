export class SearchQuery {
    static SEARCH_PATTERN = 'i';

    #rawSearchs;

    constructor(searchTransformed) {
        this.#rawSearchs = searchTransformed;
    }

    /**
     * @access This method to communicate with queryBuilder.
     * Do not call this when you are building Search query
     * @author dangphu2412
     * @version 1.0
     */
    generate() {
        if (this.#rawSearchs) {
            const searchQuery = {
                $or: []
            };

            const searchRegex = {
                $regex: this.#rawSearchs.value,
                $options: SearchQuery.SEARCH_PATTERN
            };

            this.#rawSearchs.criteria.forEach(field => {
                const searchItem = {};
                searchItem[field] = searchRegex;
                searchQuery['$or'].push(searchItem);
            });

            return searchQuery;
        }
        return null;
    }

    /**
     * @access This method provide an flexible way to add custom search to existed query
     * @author dangphu2412
     * @version 1.0
     */
    addSearchField(field) {
        this.#rawSearchs.criteria.push(field);
        return this;
    }

    addSearchValue(value) {
        this.#rawSearchs.value = value;
        return this;
    }

    addSearchValueSafety(value) {
        if (this.#rawSearchs.value) {
            throw new Error(`Value in ${SearchQuery.name} was set and can not modify by adding with method addSearchValueSafety`);
        }
        this.addSearchValue(value);
        return this;
    }
}
