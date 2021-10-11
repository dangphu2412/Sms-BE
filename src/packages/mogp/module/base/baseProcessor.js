/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import mongoose from 'mongoose';
import { MogpConfig } from 'packages/mogp/core/config';
import { BaseContainer } from 'packages/container/core/container';
import { parallel, serial } from 'packages/taskExecution';

export class BaseProcessor {
    collector;

    #tasks = [];

    /**
     *
     * @param {BaseContainer} collector
     */
    constructor(collector) {
        if (!(collector instanceof BaseContainer)) {
            throw new Error('collector is not instance of BaseContainer');
        }
        this.collector = collector;
    }

    setTasks(tasks) {
        this.#tasks = tasks;
    }

    /**
     * @returns {Promise<void> | void}
     */
    preProcess(tasks) {
        throw new Error('Class extends BaseProcessor is not implemented method preProcess');
    }

    /**
     * @returns {Promise<void> | void}
     */
    afterProcess() {
        throw new Error('Class extends BaseProcessor is not implemented method afterProcess');
    }

    /**
     * @returns {Promise<boolean> | boolean}
     */
    preRun(task) {
        return true;
    }

    /**
     * @returns {Promise<void> | void}
     */
    afterRun(task) {
        throw new Error('Class extends BaseProcessor is not implemented method afterRun');
    }

    async process() {
        console.log('\x1B[92mCollecting instances');

        await this.collector.collect();

        this.#tasks = await parallel(Object.keys(this.collector.store), key => {
            console.log(`Collecting: ${key}`);
            return this.collector.store[key];
        });

        console.log('\x1B[92mConnecting to database');

        try {
            await mongoose.connect(MogpConfig.getConfig().connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        } catch (error) {
            throw new Error('Please recheck connectionString in mogp.config.json');
        }

        await this.preProcess(this.#tasks);
        console.log('Finish collect instances');
        console.log('\x1B[31mStart process');
        await serial(this.#tasks, async task => {
            try {
                if (await this.preRun(task)) {
                    console.log(`\x1B[92m🐧 ========== Running task: ${task.name} ===========🐧`);
                    await task.run();
                    console.log(`🐧 ========== Finish task: ${task.name} ===========🐧`);
                    await this.afterRun(task);
                }
            } catch (error) {
                console.error(error.message);
                process.exit(0);
            }
        });

        await this.afterProcess(this.#tasks);
        console.log('\x1B[31mFinish process');
    }
}
