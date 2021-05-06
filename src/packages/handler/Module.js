import express from 'express';
import { logger } from '../../core/modules/logger/winston';
import { ArgumentRequired } from './exceptions/ArgumentRequired';
import { SwaggerContentCreator } from '../swagger/rebuild/content';
import { SwaggerContentDto } from '../swagger/model/SwaggerContentDto';
import { HttpException } from '../httpException/HttpException';
import { AUTH_CONTEXT } from '../authModel/common/enum/authContext';
import { UnAuthorizedException } from '../httpException';
import { MethodRequired } from './exceptions/MethodRequired';
import { HttpResponse } from './response/http.response';
import { InValidHttpResponse } from './response/invalidHttp.response';

export class Module {
    static logger = logger;

    /**
     * @type {
     [
        {
            route,
            controller,
            method,
            middlewares,
            preAuthorization,
            description,
            model?:any,
            params?: any
        }
     ]
     } content
     */
    #swaggerContent = [];

    /**
     * @type {
        {
            prefixPath,
            tag,
            module
        }
    }
     */
    #prefix;

    #router = express.Router();

    static builder() {
        return new Module();
    }

    static #producePreAuthorizeMiddleware = (req, res, next) => {
        if (!req[AUTH_CONTEXT.KEY_AUTH_CONTEXT]) {
            throw new UnAuthorizedException();
        }
        return next();
    }

    static #produceGuard = guardClass => {
        if (!guardClass['canActive']) {
            throw new MethodRequired(guardClass.constructor.name, 'canActive');
        }
        return async (req, res, next) => {
            const canActive = await guardClass.canActive(req);

            if (!canActive) {
                throw new UnAuthorizedException('Unauthorized');
            }
            return next();
        };
    }

    static #produceInterceptor = interceptorClass => {
        if (!interceptorClass['intercept']) {
            throw new MethodRequired(interceptorClass.constructor.name, 'intercept');
        }
        return interceptorClass.intercept;
    }

    #createHandler = controller => async (request, response) => {
        try {
            const data = await controller(request);
            if (!(data instanceof HttpResponse)) {
                return InValidHttpResponse
                    .toInternalResponse(
                        `${data.constructor.name} is not instance of HttpResponse.`
                        + 'Should use HttpResponse to build http response'
                    )
                    .toResponse(response);
            }
            return data.toResponse(response);
        } catch (err) {
            if (err instanceof HttpException) {
                return new InValidHttpResponse(err.status, err.code, err.message)
                    .toResponse(response);
            }
            Module.logger.error(err.message);
            return InValidHttpResponse
                .toInternalResponse(err.message)
                .toResponse(response);
        }
    }

    /**
     * @param {
        {
            route,
            controller,
            method,
            middlewares,
            preAuthorization,
            description,
            model?:any,
            params?: any
        }
     } content
     */
    #addSwaggerContent = content => {
        const jsonContent = SwaggerContentDto(content);

        this.#swaggerContent.push(
            SwaggerContentCreator
                .builder()
                .fromJson(jsonContent)
                .addPrefix(this.#prefix)
                .build()
        );
    }

    addPrefix({ prefixPath = '/', tag, module }) {
        if (!module) {
            throw new ArgumentRequired('module', 'addPrefix function');
        }
        this.#prefix = {
            prefixPath,
            tag,
            module
        };
        return this;
    }

    /**
     * @param {
        [{
            route,
            controller,
            method,
            interceptors,
            guards,
            preAuthorization,
            description,
            model?:any,
            params?: any
        }]
     } apis
     */
    register(apis) {
        Module.logger.info(`[${this.#prefix.module}] is bundling`);

        apis.forEach(api => {
            const {
                route, controller, method, preAuthorization, interceptors, guards
            } = api;
            const middlewares = [];
            if (preAuthorization) {
                middlewares.push(Module.#producePreAuthorizeMiddleware);
            }

            if (interceptors?.length > 0) {
                interceptors.forEach(interceptor => {
                    middlewares.push(Module.#produceInterceptor(interceptor));
                });
            }

            if (guards?.length > 0) {
                guards.forEach(guard => {
                    middlewares.push(Module.#produceGuard(guard));
                });
            }
            this.#router[method](route, ...middlewares, this.#createHandler(controller));

            Module.logger.info(`[${this.#prefix.module}] ${method.toUpperCase()} ${this.#prefix.prefixPath}${route} mapped ${controller.name}`);

            this.#addSwaggerContent(api);
        });
        return this;
    }

    build(globalRoute) {
        globalRoute.use(this.#prefix.prefixPath, this.#router);
    }

    /**
     * @notes this function will be triggered whenever handler resolver is registered
     * @param {import('../swagger/rebuild/core').SwaggerBuilder} swaggerInstance
     */
    buildSwagger(swaggerInstance) {
        swaggerInstance.addTag(this.#prefix.tag);
        this.#swaggerContent.forEach(content => {
            swaggerInstance.api(content);
        });
    }
}
