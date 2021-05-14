export class ResponseTransformer {
    constructor(data) {
        this.data = data;
        this.res = {
            name: this.data.name,
            leader: this.data.leaderId,
            members: this.data.userIds,
            childs: [],
        };
    }

    generalCase() {
        const childIdResTransform = [];
        if (this.data.childIds.length > 0) {
            this.data.childIds.forEach(child => {
                childIdResTransform.push({
                    id: child._id,
                    name: child.name,
                });
            });
        }
        this.res.childs = childIdResTransform;
        return this.res;
    }

    detailCase() {
        const childIdResTransform = [];
        if (this.data.childIds.length > 0) {
            this.data.childIds.forEach(child => {
                childIdResTransform.push({
                    id: child._id,
                    name: child.name,
                    members: child.userIds
                });
            });
        }
        this.res.childs = childIdResTransform;
        return this.res;
    }
}
