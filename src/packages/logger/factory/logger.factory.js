import { createLogger as create } from 'winston';
import { OutputFormat } from '../format/output.format';
import { TransportGenerator } from '../enum/transport.enum';
import { TransportFactory } from './transport.factory';

export class LoggerFactory {
    static globalLogger = LoggerFactory.create();

    static create(name) {
        return LoggerFactory.createByTransports(
            TransportFactory.create(
                TransportGenerator.Console,
                new OutputFormat(name)
            )
        );
    }

    /**
     * 
     * @param  {...import('winston').transports.Transports} transports 
     */
    static createByTransports(...transports) {
        return create({ transports });
    }
}
