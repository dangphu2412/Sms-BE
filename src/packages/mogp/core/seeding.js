/* eslint-disable no-console */
import { SetupEnum } from '../constants';
import { SeedingProcessor } from '../module/processor/seedingProcessor';
import { setup } from '../util/setup';

(async () => {
    try {
        setup(SetupEnum.SEEDING);
        console.log('\x1B[31mStart seeding');
        await new SeedingProcessor().process();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    } finally {
        process.exit(0);
    }
})();
