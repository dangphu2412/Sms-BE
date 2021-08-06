import fs from 'fs';
import { SetupEnum } from '../constants';
import { MogpConfig } from '../core/config';

export function setup(type) {
    let config;
    const PATH_CONNECTION = `${process.cwd()}/mogp.config.json`;
    try {
        config = JSON.parse(fs.readFileSync(PATH_CONNECTION));
    } catch (error) {
        throw new Error(`File mogp.config.json is missing in ${process.cwd()}`);
    }
    switch (type) {
        case SetupEnum.MIGRATION:
            if (!config.connectionString || !config.pathMigration) {
                throw new Error('Missing config connectionString or pathMigration in mogp.config.json');
            }
            break;
        case SetupEnum.SEEDING:
            if (!config.connectionString || !config.pathSeeding) {
                throw new Error('Missing config connectionString or pathSeeding in mogp.config.json');
            }
            break;
        case SetupEnum.ROLLBACK:
            if (!config.connectionString || !config.pathRollback) {
                throw new Error('Missing config connectionString or pathRollback in mogp.config.json');
            }
            break;
        default:
            throw new Error('Unsupported type for setup');
    }
    MogpConfig.config({
        connectionString: config.connectionString,
        pathMigration: config.pathMigration,
        pathSeeding: config.pathSeeding,
        pathRollback: config.pathRollback
    });
}
