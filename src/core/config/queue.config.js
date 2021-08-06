import { MailConsumer } from 'core/modules/mail/mail.consumer';
import { QueueRegister } from 'core/modules/queue/queue.register';

const queueRegister = new QueueRegister();

queueRegister.addListener(MailConsumer);

export { queueRegister };
