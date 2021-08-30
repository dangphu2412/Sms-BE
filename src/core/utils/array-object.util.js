import { omit, sortBy, isEqual } from 'lodash';
import { parseObjectId } from 'core/utils';

export class ArrayObjectUtils {
    /**
     * @param {Array<object>} arr 
     * @param {string} key
     * @returns {Array} array of object's value
     */
    static mapByKey(arr, key) {
        return arr.map(obj => obj[key]);
    }

    /**
     * @param {Array<object>} arr 
     * @param {Array<string>} keys
     * @returns {Array} array of key-removed objects
     */
    static removeByKey(arr, keys) {
        return arr.map(obj => omit(obj, keys));
    }

    /**
     * @param {Array<any>} arr1 
     * @param {Array<any>} arr2 
     * @returns {Boolean}
     */
    static isEqualArray(arr1, arr2) {
        return isEqual(sortBy(arr1), sortBy(arr2));
    }

    /**
     * @param {Array<object>} inputArr 
     * @param {string} keyId id field name
     * @returns {Array} ObjectIds
     */
    static mapParsedObjectIdToArr(inputArr, keyId) {
        return this.mapByKey(inputArr, keyId).map(strId => parseObjectId(strId));
    }
}
