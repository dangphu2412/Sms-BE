import mongoose from 'mongoose';
import { ConfigService } from 'packages/config/config.service';
import { MongooseProvider } from '../modules/mongoose/MongooseProvider';

export const DatabaseInstance = MongooseProvider
    .builder()
    .setConnectionString(ConfigService.getSingleton().get('DATABASE_URL'))
    .setMongooseInstance(mongoose);
