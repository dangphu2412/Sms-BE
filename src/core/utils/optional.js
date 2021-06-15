export class Optional {
    #instance;

    constructor(instance) {
        this.#instance = instance;
    }

    static of(instance) {
        return new Optional(instance);
    }

    throwIfPresent(exception) {
        if (this.#instance && !this.#instance.deletedAt) {
            throw exception;
        }
        return this;
    }

    throwIfNotPresent(exception) {
        if (!this.#instance || this.#instance.deletedAt !== null) {
            throw exception;
        }
        return this;
    }

    throwIfNullable(exception) {
        if (this.#instance === null) {
            throw exception;
        }
        return this;
    }

    throwIfExist(exception) {
        if (this.#instance) {
            throw exception;
        }
        return this;
    }

    get() {
        return this.#instance;
    }
}
