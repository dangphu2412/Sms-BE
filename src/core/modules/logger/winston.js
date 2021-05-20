import { createLogger, transports, format } from 'winston';
import { join } from 'path';

const {
    combine, timestamp,
    printf, colorize,
    splat, simple
} = format;

const errorFilename = join(process.cwd(), 'logs/errors.log');

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: combine(
                simple(), splat(),
                timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                colorize(),
                printf(log => `[${log.timestamp}] [${log.level}] ${log.message}`)
            ),
            colorize: true,
        }),
        // write errors to file
        new transports.File({
            filename: errorFilename,
            level: 'error',
            format: simple(),
        })
    ],
});

export { logger };
