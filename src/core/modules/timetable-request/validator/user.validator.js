import { UserRepository } from 'core/modules/user';
import { Optional } from 'core/utils';
import { NotFoundException } from 'packages/httpException';

export class UserValidator {
    constructor(id) {
        this.id = id;
        this.repository = UserRepository;
    }

    async validate() {
        Optional
            .of(await this.repository.findById(this.id))
            .throwIfNotPresent(new NotFoundException('User not found'));
    }
}
