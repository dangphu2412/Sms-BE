import { AuthorizationService } from 'packages/authModel/module/authorization/AuthorizationService';
import { Rules } from '../rules';

export const authorization = AuthorizationService
    .builder(Rules);
