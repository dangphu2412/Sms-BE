import { ArrayUtils } from 'packages/utils/array.util';
import { compareIdInObject, toObjectId } from './objectId.utils';

/**
 *
 * @param {import('mongoose').Document[]} collection
 * @param {import('mongoose').Types.ObjectId[]} byIds
 * @param {(_id: import('mongoose').Types.ObjectId, objectInCollection: import('mongoose').Document) => boolean} accumulator
 * @returns {import('mongoose').Types.ObjectId[]}
 */
export function filterIn(collection, byIds, accumulator) {
    if (ArrayUtils.isEmpty(collection)) return byIds;
    return byIds
        .filter(_id => collection
            .some(item => accumulator(_id, item)));
}

/**
 *
 * @param {import('mongoose').Document[]} comparableArrayObject
 * @param {import('mongoose').Types.ObjectId[]} fromIds
 * @returns {import('mongoose').Types.ObjectId[]}
 */
export function takeInvalidIds(fromIds, comparableArrayObject) {
    return filterIn(
        comparableArrayObject,
        fromIds,
        (id, sourceObject) => !compareIdInObject(sourceObject, id)
    );
}

/**
 *
 * @param {import('mongoose').Document[]} sourceArrayObject
 * @param {string} key
 * @param {string|} keyMapper
 * @returns {import('mongoose').Types.ObjectId[]}
 */
export function mapByKey(sourceArrayObject, key, keyMapper) {
    if (!keyMapper) return sourceArrayObject.map(obj => obj[key]);
    return sourceArrayObject.map(obj => keyMapper(obj[key]));
}

/**
 *
 * @param {import('mongoose').Document[]} sourceArrayObject
 * @param {string} key
 * @returns {import('mongoose').Types.ObjectId[]}
 */
export function mapByKeyWithObjectIdParser(sourceArrayObject, key) {
    return mapByKey(sourceArrayObject, key, toObjectId);
}
