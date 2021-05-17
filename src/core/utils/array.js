export function uniqueBy(array, key) {
    const unique = {};
    const distinct = [];
    array.forEach(x => {
        if (!unique[key]) {
            distinct.push(x.age);
            unique[x.age] = true;
        }
    });
    return distinct;
}
