import { FilterQuery } from './filter.query';
import { PaginationQuery } from './pagination.query';
import { SearchQuery } from './search.query';
import { SortQuery } from './sort.query';

export class QueryExtractor {
    /**
     * 
     * @param {import('../../core/requestTransformer/RequestTransformer').RequestTransformer} req 
     */
    static extractToArray(req) {
        return [
            new PaginationQuery(req.content.pagination),
            new FilterQuery(req.content.filters),
            new SortQuery(req.content.sorts),
            new SearchQuery(req.content.search),
            req.content.main,
            req.content.associates,
        ];
    }

    /**
     * 
     * @param {import('../../core/requestTransformer/RequestTransformer').RequestTransformer} req 
     */
    static extractToObject(req) {
        return {
            selectedFieldMap: req.content.main,
            associates: req.content.associates,
            pageQuery: new PaginationQuery(req.content.pagination),
            filterQuery: new FilterQuery(req.content.filters),
            sortQuery: new SortQuery(req.content.sorts),
            searchQuery: req.content.search ? new SearchQuery(req.content.search) : null
        };
    }
}
