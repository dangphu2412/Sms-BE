import { ConfigService } from 'packages/config/config.service';

export class ForgotPasswordTemplate {
    static #HOST = ConfigService.getSingleton().get('FE_HOST');

    #account;

    #refreshPasswordToken;

    constructor(account, refreshPasswordToken) {
        this.#account = account;
        this.#refreshPasswordToken = refreshPasswordToken;
    }

    getSubject() {
        return `Lấy lại mật khẩu cho tài khoản ${this.#account}`;
    }

    getHtml() {
        return `
            <strongs>Bạn quên mật khẩu của tài khoản ${this.#account}</strong>
            <strongs>Lá thư này sẽ tồn tại trong 1 tiếng kể từ lúc gửi</strong>
            <button><a href='${ForgotPasswordTemplate.#HOST}/forgot-password?${this.#refreshPasswordToken}'>Bấm vào đây để lấy lại mật khẩu</button>
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
