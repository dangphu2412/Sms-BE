import { isObjectId, toObjectId } from 'core/modules/mongoose/utils/objectId.utils';

export class WeakSetObjectId {
    /**
     *
     * @type {Record<string, import('mongoose').Types.ObjectId>}
     */
    dictionary = {};

    /**
     *
     * @param {import('mongoose').Types.ObjectId} key
     */
    add(key) {
        if (isObjectId(key)) {
            this.dictionary[key.toHexString()] = key;
            return;
        }

        this.dictionary[key] = toObjectId(key);
    }

    /**
     *
     * @param {(import('mongoose').Types.ObjectId[]} keys
     */
    addAll(keys) {
        keys.forEach(key => {
            this.add(key);
        });
    }

    /**
     *
     * @param {import('mongoose').Types.ObjectId} key
     */
    remove(key) {
        if (isObjectId(key)) {
            delete this.dictionary[key.toHexString()];
            return;
        }
        delete this.dictionary[key];
    }

    /**
     *
     * @param {(import('mongoose').Types.ObjectId} keys
     */
    removeAll(keys) {
        keys.forEach(key => {
            this.remove(key);
        });
    }

    /**
     *
     * @param {import('mongoose').Types.ObjectId} key
     */
    has(key) {
        if (isObjectId(key)) {
            return this.dictionary[key.toHexString()];
        }
        return this.dictionary[key];
    }

    toArray() {
        return Object.values(this.dictionary);
    }
}
