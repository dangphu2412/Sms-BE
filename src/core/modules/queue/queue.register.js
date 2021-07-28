import { LoggerFactory } from 'packages/logger';
import { parallel } from 'packages/taskExecution';

export class QueueRegister {
    #queues = [];

    async publish() {
        try {
            await parallel(this.#queues, queue => queue.register());
        } catch (error) {
            LoggerFactory.globalLogger.error(error.message);
        }
    }

    addListener(queue) {
        this.#queues.push(queue);
    }
}
