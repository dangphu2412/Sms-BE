export class ArrayUtils {
    /**
     *
     * @param {[] | undefined | null} collection
     * @returns
     */
    static isPresent(collection) {
        return Array.isArray(collection) && collection.length > 0;
    }

    static isEmpty(collection) {
        return Array.isArray(collection) && collection.length === 0;
    }
}
