import { MailConsumer } from 'core/modules/queue/consumer/mail.consumer';
import { QueueRegister } from 'core/modules/queue/queue.register';

const queueRegister = new QueueRegister();

queueRegister.addListener(MailConsumer);

export { queueRegister };
