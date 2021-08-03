/* eslint-disable no-console */
import { MigrationState } from 'packages/mogp/constants';
import { MigrationModel } from 'packages/mogp/model/Migration';
import { BaseProcessor } from '../base/baseProcessor';
import { MigrationCollector } from '../collector/migrationCollector';

export class MigrationProcessor extends BaseProcessor {
    #state = MigrationState.UPDATE;

    #id;

    #history = [];

    constructor() {
        super(MigrationCollector.builder());
    }

    async preProcess(tasks) {
        const migrations = (await MigrationModel.find())[0];

        // New migrations
        if (!migrations) {
            this.#state = MigrationState.NEW;
            return;
        }

        migrations.history.forEach((item, index) => {
            if (item !== tasks[index].name) {
                throw new Error('History of migration has changed');
            }
            this.#history.push(item);
        });
        const notToUpdate = (tasks.length - migrations.history.length) === 0;

        // No need migration because it is the same as old
        if (notToUpdate) {
            this.#state = MigrationState.NONE;
            this.setTasks([]);
            return;
        }

        const newTasks = [];

        for (let i = this.#history.length; i < tasks.length; i += 1) {
            newTasks.push(tasks[i]);
        }

        this.#id = migrations._id;
        this.setTasks(newTasks);
    }

    preRun() {
        return true;
    }

    afterRun(task) {
        this.#history.push(task.name);
    }

    afterProcess() {
        switch (this.#state) {
            case MigrationState.NEW:
                console.log('Insert migration history to database');
                return MigrationModel.create({
                    history: this.#history
                });
            case MigrationState.UPDATE:
                console.log('Update migration history to database');
                return MigrationModel.updateOne(
                    {
                        _id: this.#id
                    }, {
                        history: this.#history
                    }
                );
            case MigrationState.NONE:
                console.log('Migration history is not changed');
                break;
            default:
                throw new Error('Unsupported state of migration');
        }
    }
}
