import { ConfigService } from 'packages/config/config.service';

export class ChangePasswordTemplate {
    static #HOST = ConfigService.getSingleton().get('FE_HOST');

    #account;

    constructor(account) {
        this.#account = account;
    }

    getSubject() {
        return `Đổi mật khẩu cho tài khoản ${this.#account}`;
    }

    getHtml() {
        return `
            <strongs>Tài khoản ${this.#account} vừa được tạo trong hệ thống của Sgroup</strong>
            <button><a href='${ChangePasswordTemplate.#HOST}'>Đến trang của sgroup nào</button>
        `;
    }

    /**
     * @returns {import('@sendgrid/mail').MailDataRequired}
     */
    toMailData() {
        return {
            subject: this.getSubject(),
            html: this.getHtml()
        };
    }
}
