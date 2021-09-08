import { isEmpty } from 'lodash';
import { DocumentVisitor } from './document.visitor';

/**
 * @description This class will clean your input document then return the data that you want to update
 */
export class DocumentCleanerVisitor extends DocumentVisitor {
    visit() {
        const plainObject = this.document.toObject({ getters: true });
        Object
            .keys(plainObject)
            .forEach(key => {
                if (isEmpty(plainObject[key])) {
                    delete plainObject[key];
                }
            });
    }
}
