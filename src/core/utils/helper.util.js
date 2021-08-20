import { pickBy, keysIn } from 'lodash';
import mongoose from 'mongoose';

export function toObjectId(str) {
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
