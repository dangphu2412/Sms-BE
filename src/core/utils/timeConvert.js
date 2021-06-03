import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const DATE_FORMAT = 'DD/MM/YYYY';

export const toTimestamp = strDate => {
    if (!strDate || strDate === '') return null;
    if (!dayjs(strDate, DATE_FORMAT, true).isValid()) return NaN;

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
