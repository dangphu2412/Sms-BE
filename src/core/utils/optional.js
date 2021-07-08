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

    throwIfMissingValues(refFields, exception) {
        refFields = [...new Set(refFields)];
        if (this.#instance.length !== refFields.length) {
            throw exception;
        } else {
            this.#instance.forEach(value => {
                if (value.deletedAt || value.isActive === false) throw exception;
            });
        }
    }

    get() {
        return this.#instance;
    }
}
