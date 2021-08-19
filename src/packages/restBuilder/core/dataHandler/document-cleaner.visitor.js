import { isEmpty } from 'lodash';
import { DocumentVisitor } from './document.visitor';

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
