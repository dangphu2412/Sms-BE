#!/usr/bin/env node
/**
 * Module dependencies.
 */

import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import debug from 'debug';
import http from 'http';
import { ConfigService } from 'packages/config/config.service';
import app from '../index';

const debugHelper = debug('mongoose:server');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const parsePort = parseInt(val, 10);

    if (Number.isNaN(parsePort)) {
    // named pipe
        return val;
    }

    if (parsePort >= 0) {
    // port number
        return parsePort;
    }

    return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(ConfigService.getSingleton().get('PORT'));
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            LoggerFactory.globalLogger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            LoggerFactory.globalLogger.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    debugHelper(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
    LoggerFactory.globalLogger.info(`Server is listening on ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);
