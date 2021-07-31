import { SwaggerDocument } from 'packages/swagger';

export const actionTimetableRequestSwagger = [
    SwaggerDocument.ApiParams({
        name: 'type',
        paramsIn: 'query',
        required: true,
        type: 'string',
    }),
];
