/* eslint-disable no-console */
import { SetupEnum } from '../constants';
import { MigrationProcessor } from '../module/processor/migrationProcessor';
import { setup } from '../util/setup';

(async () => {
    try {
        setup(SetupEnum.MIGRATION);
        console.log('\x1B[31mStart migration');
        await new MigrationProcessor().process();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    } finally {
        process.exit(0);
    }
})();
