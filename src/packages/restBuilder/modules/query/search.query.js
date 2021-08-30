export class SearchQuery {
    static SEARCH_PATTERN = 'i';

    #searchQuery;

    #searchValue;

    constructor(searchTransformed) {
        this.#searchQuery = SearchQuery.toQuery(searchTransformed);
        this.#searchValue = searchTransformed?.value;
    }

    static toSearchItem(value) {
        return {
            $regex: value,
            $options: SearchQuery.SEARCH_PATTERN
        };
    }

    static toQuery(searchTransformed) {
        if (searchTransformed) {
            const searchQuery = {
                $or: []
            };

            searchTransformed.criteria.forEach(field => {
                const searchItem = {};
                searchItem[field] = SearchQuery.toSearchItem(searchTransformed.value);
                searchQuery.$or.push(searchItem);
            });

            return searchQuery;
        }
        return null;
    }

    /**
     * @access This method to communicate with queryBuilder.
     * Do not call this when you are building Search query
     * @author dangphu2412
     * @version 1.0
     * @returns {{$or: Record<string, any>[]} | null} can return null
     */
    getQuery() {
        return this.#searchQuery;
    }

    /**
     * @access This method provide an flexible way to add custom search to existed query
     * @author dangphu2412
     * @version 1.0
     */
    addSearchField(field) {
        this.#searchQuery.$or.push({
            [field]: SearchQuery.toSearchItem(this.#searchValue)
        });
        return this;
    }
}
