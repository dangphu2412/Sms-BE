import { BaseContainer } from 'packages/container/core/container';
import { MogpConfig } from 'packages/mogp/core/config';

export class MigrationCollector extends BaseContainer {
    pattern = MogpConfig.getConfig().pathMigration;
}
