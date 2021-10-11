import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { UniversityModel } from './university.model';

class UniversityRepositoryImpl extends DataRepository {
    constructor() {
        super(UniversityModel);
    }
}

export const UniversityRepository = new UniversityRepositoryImpl();
