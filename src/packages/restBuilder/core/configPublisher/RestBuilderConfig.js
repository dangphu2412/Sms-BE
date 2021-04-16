import { ConfigPublisher } from './ConfigPublisher';
import { PaginationFactory } from '../../modules/factory/pagination.factory';

/**
 *
 * @type {ConfigPublisher}
 * @notes
 - This will provide a publish configuration of rest builder
 via config() method
 - We need to config this in the core module
 - Example: src/core/config/restBuilder.js
 * @access .config() method
 */
export const RestBuilderConfig = new ConfigPublisher()
    .addListener(PaginationFactory);
