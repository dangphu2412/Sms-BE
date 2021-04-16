// @ts-check
import * as express from 'express';
import methodOverride from 'method-override';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { logger } from '../modules/logger/winston';
import { DatabaseInstance } from './database';
import { CORS_ALLOW } from '../env';
import { InvalidFilter } from '../common/exceptions/system/InvalidFilter';

export class AppBundle {
    #swaggerBuilder;

    static logger = logger;

    BASE_PATH = '/api';

    BASE_PATH_SWAGGER = '/docs';

    static builder() {
        AppBundle.logger.info('🌶🌶🌶 App is starting bundling 🌶🌶🌶');
        return new AppBundle();
    }

    /**
     * @param {import("express-serve-static-core").Express} app
     */
    applyAppContext(app) {
        this.app = app;
        return this;
    }

    /**
     * @param {import('../../packages/handler/HandlerResolver')} resolver
     */
    applyResolver(resolver) {
        this.app.use(this.BASE_PATH, resolver);
        return this;
    }

    /**
     *
     * @param {[]} filters
     * @returns {AppBundle}
     */
    applyGlobalFilters(filters) {
        filters.forEach(filter => {
            if (filter['filter']) {
                this.app.use(filter.filter);
            } else {
                throw new InvalidFilter(filter);
            }
        });
        return this;
    }

    applySwagger(swaggerBuilder) {
        this.#swaggerBuilder = swaggerBuilder;
        return this;
    }

    /**
     * Default config
     */
    init() {
        /**
         * Setup basic express
         */
        this.app.use(cors({
            origin: CORS_ALLOW,
            optionsSuccessStatus: 200
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        /**
         * Setup method override method to use PUT, PATCH,...
         */
        this.app.use(methodOverride('X-HTTP-Method-Override'));
        this.app.use(
            methodOverride(req => {
                if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                    const method = req.body._method;
                    delete req.body._method;

                    return method;
                }

                return undefined;
            }),
        );
        AppBundle.logger.info('🌶🌶🌶 Building initial config 🌶🌶🌶');
        return this;
    }

    /*
    Setup asynchronous config here
     */
    async run() {
        AppBundle.logger.info('🌶🌶🌶 Building asynchronous config 🌶🌶🌶');
        this.app.use(
            this.BASE_PATH_SWAGGER,
            swaggerUi.serve,
            swaggerUi.setup(this.#swaggerBuilder.instance)
        );
        AppBundle.logger.info('🌶🌶🌶 Building swagger 🌶🌶🌶');
        await DatabaseInstance.connect();
    }
}
