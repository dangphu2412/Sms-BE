import { SwaggerDocument } from 'packages/swagger';

export const getTimetableRequestQuerySwagger = [
    SwaggerDocument.ApiParams({
        name: 'type',
        paramsIn: 'query',
        required: false,
        type: 'string',
    }),
    SwaggerDocument.ApiParams({
        name: 'status',
        paramsIn: 'query',
        required: false,
        type: 'string',
    })
];
