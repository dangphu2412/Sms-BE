export class JwtValidator {
    #accessToken;

    static builder() {
        return new JwtValidator();
    }

    applyToken(accessToken) {
        this.#accessToken = accessToken;
        return this;
    }

    validate() {
        /**
         * TODO: Validate access token here
         */
    }
}
