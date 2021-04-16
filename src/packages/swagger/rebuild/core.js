import { BEARER_AUTH_CONFIG } from '../constants';

export class SwaggerBuilder {
    instance = {};

    static builder() {
        return new SwaggerBuilder();
    }

    #initAuth = isAuthRequired => {
        if (isAuthRequired) {
            this.instance.components['securitySchemes'] = {
                bearerAuth: BEARER_AUTH_CONFIG,
            };
        }
    }

    #toResponseSuccess = model => ({
            200: {
                description: 'successful operation',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {
                                $ref: `#/components/schemas/${model}`,
                            },
                        },
                    },
                },
            },
        })

    #toErrors = () => {

    }

    addConfig(options) {
        const {
            openapi,
            info,
            servers,
            auth,
            basePath,
        } = options;

        this.instance.openapi = openapi;
        this.instance.info = info;
        this.instance.servers = servers;
        this.instance.basePath = basePath;
        this.instance.components = {
            schemas: {},
        };
        this.instance.tags = [];
        this.instance.paths = {};
        this.#initAuth(auth);
        return this;
    }

    addTag(name) {
        if (!this.instance.tags.some(tag => tag === name)) this.instance.tags.push(name);
    }

    /**
     * @param {
     {
        route?: any,
        method?: any,
        tags?: any,
        description?: any,
        security?: any,
        model?: string,
        body?:any,
        params?:any,
        consumes?:any
    }} options
     */
    api(options) {
        const {
            route,
            method,
            tags,
            description,
            security,
            model,
            body,
            params = [],
            consumes = [],
        } = options;
        const responses = {};

        if (!this.instance.paths[route]) {
            this.instance.paths[route] = {};
        }

        this.instance.paths[route][method] = {
            tags: tags.length ? tags : [tags],
            description,
            security: security ? [
                {
                    bearerAuth: [],
                },
            ] : [],
            produces: [
                'application/json',
            ],
            consumes,
            parameters: params,
            requestBody: body ? {
                content: {
                    'application/json': {
                        schema: {
                            $ref: `#/components/schemas/${body}`,
                        },
                    },
                },
                required: true,
            } : {},
            responses: {
                ...responses,
                ...this.#toResponseSuccess(model),
            },
        };
    }

    addModel(name, properties) {
        this.instance.components.schemas[name] = {
            type: 'object',
            properties,
        };
    }
}
