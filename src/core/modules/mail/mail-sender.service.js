import { SendGridMailService } from 'core/config/sendgrid.config';
import { ConfigService } from 'packages/config/config.service';

export class MailSenderService {
    static #instance;

    static SENDER = ConfigService.getSingleton().get('SENDGRID_SENDER');

    /**
     * 
     * @returns {MailSenderService}
     */
    static getSingleton() {
        if (!MailSenderService.#instance) {
            this.#instance = new MailSenderService(SendGridMailService);
        }

        return MailSenderService.#instance;
    }

    constructor(mailService) {
        this.#mailService = mailService;
    }

    /**
     * @type {SendGridMailService}
     */
    #mailService;

    send(template, to, cc) {
        return this.#mailService.send({
            ...template,
            from: MailSenderService.SENDER,
            to,
            cc,
        });
    }
}
