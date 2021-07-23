import {
    isEqual, sortBy, pickBy, keysIn, omit
} from 'lodash';
import mongoose from 'mongoose';

export function parseObjectId(str) {
    return mongoose.Types.ObjectId(str);
}

export function filterUndefinedKey(obj) {
    return pickBy(obj, value => value !== undefined);
}

export function filterDuplicateValueByKey(desObj, refObj) {
    const desObjKeys = keysIn(desObj);

    desObjKeys.forEach(desObjKey => {
        if (desObj[desObjKey] === refObj[desObjKey]) {
            delete desObj[desObjKey];
        }
    });
    return desObj;
}
export function mapByKey(arr, key) {
    return arr.map(obj => obj[key]);
}
export function removeByKey(arr, keys) {
    return arr.map(obj => omit(obj, keys));
}
export function isEqualArray(arr1, arr2) {
    return isEqual(sortBy(arr1), sortBy(arr2));
}

export function mapParsedObjectIdToArr(inputArr, keyId) {
    return mapByKey(inputArr, keyId).map(strId => parseObjectId(strId));
}
