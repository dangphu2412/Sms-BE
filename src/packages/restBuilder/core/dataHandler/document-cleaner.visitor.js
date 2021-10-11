/* eslint-disable no-use-before-define */
import { isObjectLike, isUndefined } from 'lodash';

function cleaningDoc(document, cleanedDoc = {}) {
    Object.keys(document)
        .forEach(key => {
            if (!isUndefined(document[key])) {
                cleanedDoc[key] = documentCleanerVisitor(document[key]);
            }
        });
    return cleanedDoc;
}

export function documentCleanerVisitor(document) {
    if (isObjectLike(document)) {
        return cleaningDoc(document);
    } return document;
}
