import { transports } from 'winston';
import { OutputFormat } from '../format/output.format';

export class TransportFactory {
    /**
     * @param {./transportFormat} transportType 
     * @param {import('../format/output.format')} format instance of class OutputFormat
     * @param {} options
     * @returns 
     */
    static create(transportType, transportFormat = new OutputFormat()) {
        if (!(transportFormat instanceof OutputFormat)) {
            throw new Error(`transportFormat should be instance of ${OutputFormat.name}`);
        }

        /**
         * @interface TransportOptions class extends from OutputFormat
         * and having method getOptions will run this case
         */
        if (transportFormat['getOptions']) {
            return new transports[transportType]({
                format: transportFormat.get(),
                colorize: true,
                ...transportFormat.getOptions()
            });
        }

        return new transports[transportType]({
            format: transportFormat.get(),
            colorize: true,
        });
    }
}
