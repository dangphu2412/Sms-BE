/**
 * @typedef {object} MogpConfigProperty
 * @property {string} connectionString
 * @property {string} pathMigration
 * @property {string} pathSeeding
 * @property {string} pathRollback
 */

export class MogpConfig {
    /**
     * @type {MogpConfigProperty}
     */
    static #configuration;

    static config({
        connectionString,
        pathMigration,
        pathSeeding,
        pathRollback
    }) {
        this.#configuration = {
            connectionString,
            pathMigration: process.cwd() + pathMigration,
            pathSeeding: process.cwd() + pathSeeding,
            pathRollback: process.cwd() + pathRollback
        };
    }

    /**
     * 
     * @returns {MogpConfigProperty}
     */
    static getConfig() {
        if (
            !MogpConfig.#configuration.connectionString
        ) {
            throw new Error('Missing connectionString to process migration and seeding');
        }
        return MogpConfig.#configuration;
    }
}
