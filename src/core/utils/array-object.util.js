import { omit, sortBy, isEqual } from 'lodash';
import { toObjectId } from 'core/utils';

/**
     * @param {Array<object>} arr 
     * @param {string} key
     * @returns {Array} array of object's value
     */
export function mapByKey(arr, key) {
    return arr.map(obj => obj[key]);
}

/**
     * @param {Array<object>} arr 
     * @param {Array<string>} keys
     * @returns {Array} array of key-removed objects
     */
export function removeByKey(arr, keys) {
    return arr.map(obj => omit(obj, keys));
}

/**
     * @param {Array<any>} arr1 
     * @param {Array<any>} arr2 
     * @returns {Boolean}
     */
export function isSortedArrayEqual(arr1, arr2) {
    return isEqual(sortBy(arr1), sortBy(arr2));
}

/**
     * @param {Array<object>} inputArr 
     * @param {string} keyId id field name
     * @returns {Array} ObjectIds
     */
export function mapParsedObjectIdToArr(inputArr, keyId) {
    return mapByKey(inputArr, keyId).map(strId => toObjectId(strId));
}
