import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { FormModel } from '../model/formModel';

class Repository extends DataRepository {
    constructor() {
        super(FormModel);
    }
}

export const FormRepository = new Repository();
