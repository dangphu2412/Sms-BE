import { MailSenderService } from 'core/modules/mail/mail-sender.service';
import {
    LoggerFactory, OutputFormat, TransportFactory, TransportGenerator,
} from 'packages/logger';
import { FileOutputFormat } from 'packages/logger/format/file.format';
import { QueueConsumer } from '../queue/queue.consumer';

class Consumer extends QueueConsumer {
    constructor() {
        super('mail-consumer');
        this.mailSenderService = MailSenderService.getSingleton();
        this.logger = LoggerFactory.createByTransports(
            TransportFactory.create(TransportGenerator.Console, new OutputFormat('MailConsumer')),
            TransportFactory.create(TransportGenerator.File, new FileOutputFormat('MailConsumer')),
        );
    }

    process() {
        this.logger.info('Apply process');

        this.queue.process(async job => {
            this.logger.info(`Start sending email ${job.data.email}`);

            try {
                await this.mailSenderService.send(
                    job.data.template,
                    job.data.email
                );
            } catch (error) {
                this.logger.error(error.message);
                this.logger.error(error.stack);
            }

            this.logger.info(`Finish sending email ${job.data.email}`);
        });

        this.logger.info('Finish apply process');
    }
}

export const MailConsumer = new Consumer();
