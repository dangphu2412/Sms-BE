import { BaseContainer } from 'packages/container/core/container';
import { MogpConfig } from 'packages/mogp/core/config';

export class SeedingCollector extends BaseContainer {
    pattern = MogpConfig.getConfig().pathSeeding;
}
