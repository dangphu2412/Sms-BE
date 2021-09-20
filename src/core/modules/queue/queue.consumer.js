import Queue from 'bull';
import { ConfigService } from 'packages/config/config.service';
import { LoggerFactory } from '../../../packages/logger/factory/logger.factory';

export class QueueConsumer {
    static REDIS_URL = ConfigService.getSingleton().get('REDIS_URL');

    static IS_TLS_REQUIRED = ConfigService.getSingleton().get('TLS');

    /**
     * @type {import('bull').Queue}
     */
    queue;

    constructor(name) {
        const isProd = ConfigService.getSingleton().get('NODE_ENV') === 'production';

        if (isProd) {
            this.queue = new Queue(name, QueueConsumer.REDIS_URL, {
                redis: {
                    tls: { rejectUnauthorized: QueueConsumer.IS_TLS_REQUIRED === 'true' && true }
                }
            });
        } else {
            this.queue = new Queue(name, QueueConsumer.REDIS_URL);
        }
        LoggerFactory.globalLogger.info(`[${QueueConsumer.name}] is creating ${name} queue in Redis`);
    }

    /**
     * @event register() will be triggered when QueueRegister publish all consumers
     */
    async register() {
        try {
            await this.queue.isReady();
            await this.process();
            LoggerFactory.globalLogger.info(`Queue with name ${this.queue.name} is registered in Redis`);
        } catch (error) {
            LoggerFactory.globalLogger.error(error.message);
            LoggerFactory.globalLogger.error(error.stack);
            process.exit(1);
        }
    }

    /**
     * @abstract This method should be override in sub class so that it will register event of queue to process the event
     */
    process() {
        throw new Error('You must implement this process function to make queue process');
    }

    /**
     *
     * @param {any} data
     * @param {import('bull').JobOptions} options
     * @description This method will create a job for queue with the data provided in params
     */
    add(data, options) {
        return this.queue.add(data, options);
    }
}
