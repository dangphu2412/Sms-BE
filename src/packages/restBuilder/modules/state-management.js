export class StateManagement {
    static STATE_KEY = {
        FIELD: 'fieldSet',
        LIMIT: 'limitSet',
        OFFSET: 'offsetSet',
        FILTER: 'filterSet',
        SEARCH: 'searchSet'
    }

    state = {
        fieldSet: false,
        limitSet: false,
        offsetSet: false,
        filterSet: false,
        searchSet: false
    }

    lock(key) {
        this.state[key] = true;
    }

    isLocked(key) {
        return this[key];
    }

    isOpen(key) {
        return !this.isLocked(key);
    }
}
