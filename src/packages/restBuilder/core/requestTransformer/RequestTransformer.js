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
     * @param {any} req from client
     * @param relationSchema backend definition in json schema file
     */
    constructor(req, relationSchema) {
        this.content = {};
        req.searchSchema = relationSchema?.searchCriteria;
        this.content.pagination = RequestTransformer.paginationFactory.produce(req);
        this.content.filters = RequestTransformer.filterFactory.produce(req);
        this.content.sorts = RequestTransformer.sortFactory.produce(req);
        this.content.search = RequestTransformer.searchFactory.produce(req);
        this.content.main = relationSchema?.main;
        this.content.associates = relationSchema?.associates;
        RequestTransformer.constructValidator(this.content, relationSchema?.locks);
    }

    /**
     * Method to communicate with other classes
     * @returns {{
        pagination: {
            page: number,
            size: number,
            offset: number
        },
        filters: [{column: string,sign: '$eq' | '$gt' | '$like',value: string}],
        sorts: [{sort, order}],
        search,
        main: string[],
        associates
     }}
     */
    translate() {
        return this.content;
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
            RequestTransformer.sortFactory.produce(input)[0]
        );
        return this;
    }

    addFilter(input) {
        this.content.filters.push(
            RequestTransformer.filterFactory.produce(input)[0]
        );
        return this;
    }

    addSearch(input) {
        this.content.search = input;
        return this;
    }
}