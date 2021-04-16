/* eslint-disable max-len */
// @ts-check
export class SwaggerDocument {
    static type = {
        string: {
            type: 'string',
        },
        int: {
            type: 'integer',
            format: 'int64',
        },
        dateTime: {
            type: 'string',
            format: 'date-time',
        },
        bool: {
            type: 'boolean',
            default: true,
        },
        file: {
            type: 'file',
        },
        array: item => {
            if (item) {
                return {
                    type: 'array',
                    items: {
                        $ref: `#/components/schemas/${item}`,
                    }
                };
            }
            return {
                type: 'array',
                items: {
                    type: 'string'
                }
            };
        },
        enum: enumModel => ({
            type: 'string',
            enum: Object.values(enumModel),
        }),
        model: dtoModel => ({
            $ref: `#/components/schemas/${dtoModel}`,
        }),
    }

    /**
     *
     * @param {
        {
            type: 'string' | 'int' | 'dateTime' | 'bool' | 'array' | 'enum' | 'model' | {(type: string): any},
            model: string,
            required?: boolean,
            readOnly?:boolean,
            description: string
        }
     * } options
     * @returns {*&{description: string, readOnly: boolean, required: boolean}}
     * @constructor
     */
    static ApiProperty(options) {
        const {
            type,
            model,
            required = true,
            readOnly = false,
            description = 'Example',
        } = options;
        let swaggerType = SwaggerDocument.type[type];
        if (type === 'enum'
            || type === 'model'
            || type === 'array') {
            swaggerType = swaggerType(model);
        }

        return {
            required,
            description,
            readOnly,
            ...swaggerType,
        };
    }

    /**
     * @param {
        {
            name: string,
            type: 'string' | 'int' | 'dateTime' | 'bool' | 'array' | 'enum' | 'model' | {(type: string): any},
            model?:any,
            paramsIn?: 'query' | 'path',
            required?: any,
            description?: any
        }
     * } options
     * @returns {{schema, in: string, name, description: string, required: boolean}}
     * @constructor
     */
    static ApiParams(options) {
        const {
            type,
            name,
            model,
            paramsIn = 'query',
            required = true,
            description = 'Example',
        } = options;

        let swaggerType = SwaggerDocument.type[type];
        if (type === 'enum'
            || type === 'model'
            || type === 'array') {
            swaggerType = swaggerType(model);
        }
        return {
            name,
            in: paramsIn,
            schema: swaggerType,
            required,
            description,
        };
    }

    static extractParam(route) {
        const params = [];
        route.split('/').forEach(el => {
            if (el.startsWith(':')) {
                const pattern = el.split(':')[1];
                params.push({
                    name: pattern,
                    in: 'path',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                    required: true,
                });
            }
        });
        return params;
    }
}
