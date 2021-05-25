export const toTimestamp = strDate => {
    const splDate = strDate.split('/');
    const date = new Date(splDate[2], splDate[1] - 1, splDate[0]);
    return date.getTime();
};

export const toDateTime = timestamp => {
    if (timestamp % 1000 !== 0) {
        return null;
    }
    return new Date(timestamp / 1000);
};
