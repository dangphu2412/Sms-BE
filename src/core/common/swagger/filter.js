import { SwaggerDocument } from '../../../packages/swagger';

export const QueryCriteriaDocument = {
    page: SwaggerDocument.ApiParams({
        name: 'page',
        paramsIn: 'query',
        required: false,
        type: 'int',
    }),
    size: SwaggerDocument.ApiParams({
        name: 'size',
        paramsIn: 'query',
        required: false,
        type: 'int',
    }),
    sort: SwaggerDocument.ApiParams({
        name: 'sort',
        paramsIn: 'query',
        required: false,
        type: 'array',
    }),
    filter: SwaggerDocument.ApiParams({
        name: 'filter',
        paramsIn: 'query',
        required: false,
        type: 'array',
    }),
    search: SwaggerDocument.ApiParams({
        name: 'search',
        paramsIn: 'query',
        required: false,
        type: 'array',
    })
};

export const DefaultQueryCriteriaDocument = [...Object.values(QueryCriteriaDocument)];
