/**
 * @typedef {object} MogpConfigProperty
 * @property {string} connectionString
 * @property {string} pathMigration
 * @property {string} pathSeeding
 */

export class MogpConfig {
    /**
     * @type {MogpConfigProperty}
     */
    static #configuration;

    static config({
        connectionString,
        pathMigration,
        pathSeeding
    }) {
        this.#configuration = {
            connectionString,
            pathMigration: process.cwd() + pathMigration,
            pathSeeding: process.cwd() + pathSeeding
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
