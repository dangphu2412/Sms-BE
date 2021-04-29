/* eslint-disable  */
import fs from 'fs';
import mongoose from 'mongoose';

import path from 'path';
import { getSeedPathWithExtensions } from '../utils';
import { DATABASE_URL } from '../env';

class DBSeederRunner {
  static async run(seedFileNames) {
    const { seedPath, EXTENSIONS } = getSeedPathWithExtensions();
    const validFiles = [];

    if (!seedFileNames.length) {
      // Specifies all seeders
      if (fs.existsSync(seedPath)) {
        fs.readdirSync(seedPath).forEach((file) => {
          const parts = path.parse(file);
          if (EXTENSIONS.includes(parts.ext.toLowerCase())) {
            seedFileNames.push(parts.name);
          }
        });
      }
    }
    // Check if the seed file path is valid
    for (let i = 0, len = seedFileNames.length; i < len; i++) {
      const filePath = `${seedPath}/${seedFileNames[i]}${EXTENSIONS[0]}`;
      if (fs.existsSync(filePath)) {
        validFiles.push({
          file: filePath,
          name: seedFileNames[i],
        });
      }
    }
    // Run the valid seeders
    const mongoInstance = await mongoose.connect(DATABASE_URL, {
      useUnifiedTopology: true,
    });
    if (validFiles.length) {
      for (let i = 0, len = validFiles.length; i < len; i += 1) {
        const seederClass = new (require(validFiles[i].file).default)(
          mongoInstance.connection.db
        );
        await seederClass.run();
        console.log(`SEED SCRIPTS ${validFiles[i].name} DONE!`);
      }
    }
  }
}

export async function seeder(args) {
  try {
    const parameters = args.slice(2);

    await DBSeederRunner.run(parameters);
  } catch (error) {
    console.log('Seeding error >> ', error);
  } finally {
    // Connectors usually keep a pool of opened connections,
    // this keeps the process running even after all work is done.
    // We need to exit explicitly.
    process.exit(0);
  }
}

seeder(process.argv).catch((err) => {
  console.error('Cannot seeding database schema', err);
  process.exit(1);
});
