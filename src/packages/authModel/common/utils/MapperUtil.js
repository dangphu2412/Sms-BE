export class MapperUtil {
    static map(accessors, store) {
        return accessors.map(accessor => store[accessor]);
    }
}
