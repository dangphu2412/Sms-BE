import { OutputFormat } from './output.format';

export class FileOutputFormat extends OutputFormat {
    /**
     * 
     * @returns {import('winston').transports.FileTransportOptions}
     */
    getOptions() {
        return {
            filename: `${process.cwd()}/logs/${this.name}.log`,
            level: 'error'
        };
    }
}
