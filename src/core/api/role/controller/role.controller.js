import { RoleService } from '../../../modules/role/service/role.service';

class Controller {
    constructor() {
        this.service = RoleService;
    }

    findAll = req => this.service.findAll(req.query)

    createOne = req => this.service.createOne(req.body)

    findOne = req => this.service.findOne(req.params)

    patchOne = req => this.service.patchOne(req.params, req.body)

    deleteOne = req => this.service.deleteOne(req.params)
}

export const RoleController = new Controller();
