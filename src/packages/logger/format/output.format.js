import { format } from 'winston';

const {
    combine, timestamp,
    printf, colorize,
    label,
    json
} = format;

/**
 * @description Class OutputFormat can be extends
 * - getDateFormat() Override this method to change the date format
 * - getPrintTranslationCb(log) Override this method to change the log format
 * @constructor Receive name to mark label for logger format
 */
export class OutputFormat {
    static DEFAULT_DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';

    name;

    /**
     * 
     * @param {string | undefined} name logging label format
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * 
     * @override Override this method to change the date format
     */
    getDateFormat() {
        return OutputFormat.DEFAULT_DATE_FORMAT;
    }

    /**
     * 
     * @override Override this method to change the log format
     */
    getPrintTranslationCb(log) {
        return `[${log.timestamp}] [${log.level}] ${log.label} ${log.message}`;
    }

    /**
     * 
     * @access public this method can not override
     */
    get() {
        return combine(
            json(),
            timestamp({ format: this.getDateFormat() }),
            format(info => {
                info.level = info.level.toUpperCase();
                return info;
            })(),
            colorize(),
            label({ label: this.name ? ` [${this.name}]` : '' }),
            printf(this.getPrintTranslationCb)
        );
    }
}
