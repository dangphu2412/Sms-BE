const DATE_PATTERN = '^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$';
const regex = new RegExp(DATE_PATTERN, 'g');
export const toTimestamp = strDate => {
    // validate date
    if (!strDate.match(regex)) return NaN;

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
