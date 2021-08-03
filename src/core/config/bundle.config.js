// @ts-check
import * as express from 'express';
import methodOverride from 'method-override';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { InvalidResolver, InvalidFilter } from 'core/common/exceptions/system';
import { ConfigService } from 'packages/config/config.service';
import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { UserModel } from 'core/modules/user/model/user.model';
import { queueRegister } from './queue.config';
import { DatabaseInstance } from './database.config';

/**
 * @typedef Filter
 * @property {(req, res, next) => {}} filter
 */

export class AppBundle {
    BASE_PATH = '/api';

    BASE_PATH_SWAGGER = '/docs';

    static builder() {
        LoggerFactory.globalLogger.info('App is starting bundling');
        return new AppBundle();
    }

    /**
     * @param {import("express-serve-static-core").Express} app
     */
    applyAppContext(app) {
        this.app = app;
        return this;
    }

    applyResolver(resolver) {
        if (!resolver['resolve']) {
            throw new InvalidResolver(resolver);
        }
        this.app.use(this.BASE_PATH, resolver.resolve());
        return this;
    }

    /**
     *
     * @param {[Filter]} filters
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
        // if (NODE_ENV !== 'production') {
        this.app.use(
            this.BASE_PATH_SWAGGER,
            swaggerUi.serve,
            swaggerUi.setup(swaggerBuilder.instance)
        );
        LoggerFactory.globalLogger.info('Building swagger');
        // }
        return this;
    }

    /**
     * Default config
     */
    init() {
        LoggerFactory.globalLogger.info(`Application is in mode [${ConfigService.getSingleton().get('NODE_ENV')}]`);
        /**
         * Setup basic express
         */
        this.app.use(cors({
            origin: ConfigService.getSingleton().get('CORS_ALLOW'),
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
        LoggerFactory.globalLogger.info('Building initial config');

        return this;
    }

    /*
    Setup asynchronous config here
     */
    async run() {
        LoggerFactory.globalLogger.info('Building asynchronous config');
        await queueRegister.publish();
        await DatabaseInstance.connect();
        await UserModel.createIndexes();
    }
}
