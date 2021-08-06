/* eslint-disable no-console */
import { SetupEnum } from '../constants';
import { RollbackProcessor } from '../module/processor/rollbackProcessor';
import { setup } from '../util/setup';

(async () => {
    try {
        setup(SetupEnum.ROLLBACK);
        console.log('\x1B[31mStart migration');
        await (new RollbackProcessor()).process();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    } finally {
        process.exit(0);
    }
})();
