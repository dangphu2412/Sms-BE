import { FilterSign } from '../../enum';
import { BadRequestException } from '../../../httpException/BadRequestException';

export class FilterSignValidator {
    validate(obj) {
        const sign = obj[1];
        if (!FilterSign[sign]) throw new BadRequestException('Sign in filter is not valid');
    }
}
