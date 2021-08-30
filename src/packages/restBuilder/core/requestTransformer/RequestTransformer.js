import { LockValidator } from '../../modules/validator/lock.validator';
import { PaginationFactory } from '../../modules/factory/pagination.factory';
import { SortFactory } from '../../modules/factory/sort.factory';
import { FilterFactory } from '../../modules/factory/filter.factory';
import { SearchFactory } from '../../modules/factory/search.factory';
/**
 * @notes This class consists of factory which will produce the final format
 {
        pagination: {
            page,
            size,
            offset
        },
        filters,
        sorts,
        search,
        main,
        associates
     }
 */
export class RequestTransformer {
    /**
     * Method to communicate with other classes
     * @type {{
        pagination: {
            page: number,
            size: number,
            offset: number
        },
        filters: [{column: string,sign: '$eq' | '$gt' | '$like',value: string}],
        sorts: [{sort, order}],
        search: { value: string, criteria: []},
        main: string[] | string | Record<String, 1 | 0>,
        associates: string[]
     }}
     */
    content;

    static paginationFactory = new PaginationFactory();

    static sortFactory = new SortFactory();

    static filterFactory = new FilterFactory();

    static searchFactory = new SearchFactory();

    /**
     * @notes: Validator work when constructor run
     */
    static constructValidator(content, locks) {
        LockValidator.builder()
            .applySortContext(content.sorts)
            .applyFilterContext(content.filters)
            .validate(locks);
    }

    /**
     * @param {any} requestQuery from client
     * @param relationSchema backend definition in json schema file
     */
    constructor(requestQuery, relationSchema) {
        this.content = {};
        requestQuery.searchCriteria = relationSchema?.searchCriteria;
        this.content.pagination = RequestTransformer.paginationFactory.produce(requestQuery);
        this.content.filters = RequestTransformer.filterFactory.produce(requestQuery);
        this.content.sorts = RequestTransformer.sortFactory.produce(requestQuery);
        this.content.search = RequestTransformer.searchFactory.produce(requestQuery);
        this.content.main = relationSchema?.main;
        this.content.associates = relationSchema?.associates;
        RequestTransformer.constructValidator(this.content, relationSchema?.locks);
    }

    /**
     * ! All of these classes will provide method to add filter,sort,search !
     *                          via string method
     */

    setPage(page) {
        this.content.pagination.page = page;
        return this;
    }

    setSize(size) {
        this.content.pagination.size = size;
        return this;
    }

    clearPage() {
        this.content.pagination.page = null;
        return this;
    }

    clearSize() {
        this.content.pagination.size = null;
        return this;
    }

    addSort(input) {
        this.content.sorts.push(
            SortFactory.transform(input)[0]
        );
        return this;
    }

    addFilter(input) {
        this.content.filters.push(
            FilterFactory.transform(input)
        );
        return this;
    }

    setSearchValue(value) {
        this.content.search.value = value;
        return this;
    }

    addSearchCriteria(field) {
        this.content.search.criteria.push(field);
        return this;
    }

    addPopulate(populate) {
        this.content.associates.push(
            populate
        );
        return this;
    }
}
