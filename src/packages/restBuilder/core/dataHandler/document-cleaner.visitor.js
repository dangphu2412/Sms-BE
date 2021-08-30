import { isEmpty } from 'lodash';
import { DocumentVisitor } from './document.visitor';

/**
 * @description This class will clean your input document then return the data that you want to update
 */
export class DocumentCleanerVisitor extends DocumentVisitor {
    visit() {
        Object
            .keys(this.document)
            .forEach(key => {
                if (isEmpty(this.document[key])) {
                    delete this.document[key];
                }
            });
    }
}
