import express from 'express';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status';
import { logger } from '../../core/modules/logger/winston';
import { ArgumentRequired } from './exceptions/ArgumentRequired';
import { SwaggerContentCreator } from '../swagger/rebuild/content';
import { SwaggerContentDto } from '../swagger/model/SwaggerContentDto';
import { HttpException } from '../httpException/HttpException';
import { ERROR_CODE } from '../httpException/error.enum';

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

    #createHandler = controller => async (request, response) => {
        try {
            const data = await controller(request);
            return response.status(OK).json({
                status: OK,
                data,
            });
        } catch (err) {
            if (err instanceof HttpException) {
                return response.status(err.status).json({
                    status: err.status,
                    error: err.message,
                    code: err.code
                });
            }
            Module.logger.error(err.message);
            return response.status(INTERNAL_SERVER_ERROR).json({
                status: INTERNAL_SERVER_ERROR,
                error: err.message,
                code: ERROR_CODE.INTERNAL
            });
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
            middlewares,
            preAuthorization,
            description,
            model?:any,
            params?: any
        }]
     } apis
     */
    register(apis) {
        Module.logger.info(`🌶🌶🌶 [${this.#prefix.module}] is bundling 🌶🌶🌶`);

        apis.forEach(api => {
            const {
                /**
                 * @author dangphu2412
                 * Currently i will turn this lint off because we still not dev preauthorize
                 * @requires remove it whenever we finish
                 */
                // eslint-disable-next-line no-unused-vars
                route, controller, method, middlewares = [], preAuthorization
            } = api;
            this.#router[method](route, ...middlewares, this.#createHandler(controller));

            Module.logger.info(`🌶🌶🌶 [${this.#prefix.module}] ${method} ${this.#prefix.prefixPath}${route} mapped ${controller.name}`);

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
