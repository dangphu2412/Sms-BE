import { SwaggerDocument } from '../../../packages/swagger';

export const ApiFilterSwagger = [
    SwaggerDocument.ApiParams({
        name: 'page',
        paramsIn: 'query',
        required: false,
        type: 'int',
    }),
    SwaggerDocument.ApiParams({
        name: 'size',
        paramsIn: 'query',
        required: false,
        type: 'int',
    }),
    SwaggerDocument.ApiParams({
        name: 'sort',
        paramsIn: 'query',
        required: false,
        type: 'string',
    }),
    SwaggerDocument.ApiParams({
        name: 'filter',
        paramsIn: 'query',
        required: false,
        type: 'array',
    }),
    SwaggerDocument.ApiParams({
        name: 'search',
        paramsIn: 'query',
        required: false,
        type: 'array',
    }),
];
