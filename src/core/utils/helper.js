import mongoose from 'mongoose';
import path from 'path';
import { pickBy, keysIn } from 'lodash';

export function getSeedPathWithExtensions() {
    const EXTENSIONS = ['.js'];
    const SEED_PATH = 'seeds';
    const seedPath = path.join(__dirname, '..', 'database', SEED_PATH);
    return { seedPath, EXTENSIONS };
}

export function generateObjectId() {
    return mongoose.Types.ObjectId();
}

export function parseObjectId(str) {
    return mongoose.Types.ObjectId(str);
}

export function toJSON(mongoCollection) {
    return JSON.parse(JSON.stringify(mongoCollection));
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
