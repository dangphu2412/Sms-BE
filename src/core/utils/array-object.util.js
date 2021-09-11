import { omit, sortBy, isEqual } from 'lodash';

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
