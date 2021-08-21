import { isEmpty } from 'lodash';
import { DocumentVisitor } from './document.visitor';

/**
 * @description This class will deep clean your input document then return the data that you want to update
 */
export class DeepDocumentCleanerVisitor extends DocumentVisitor {
    visit() {
        this.deepClean(this.document);
    }

    deepClean(object) {
        Object
            .keys(object)
            .forEach(key => {
                if (isEmpty(object[key])) {
                    delete object[key];
                } else if (typeof object[key] === 'object') {
                    this.deepClean(object[key]);
                }
            });
    }
}
