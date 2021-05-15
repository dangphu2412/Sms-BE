/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { glob } from 'glob';

export class BaseContainer {
    pattern;

    store = {};

    static builder() {
        return new this();
    }

    /**
     * This method can be override to redefine how we collect paths
     */
    lookup() {
        if (!this.pattern) {
            throw new Error('Pattern search instance need to be define');
        }
        return glob.sync(this.pattern);
    }

    /**
     *
     * This method can be override to redefine way to store
     */
    pushToStore(reference) {
        Object.keys(reference).forEach(key => {
            if (!this.store[key]) {
                this.store[key] = reference[key];
            }
        });
    }

    async collect() {
        const filePaths = this.lookup();
        filePaths.forEach(path => {
            const exportReference = require(path);
            this.pushToStore(exportReference);
        });
        return this;
    }

    getByKey(key) {
        if (!this.store[key]) throw new Error(`${key} is not contains in store`);
        return this[key];
    }

    getMethodOfClass(key, method) {
        if (!this.store[key]) throw new Error(`${key} is not contains in store`);
        if (!this.store[key][method]) throw new Error(`${method} is not exist in ${key}`);
        return this.store[key][method];
    }
}
