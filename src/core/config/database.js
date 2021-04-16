import mongoose from 'mongoose';
import { MongooseProvider } from '../modules/mongoose/MongooseProvider';
import { DATABASE_URL } from '../env';

export const DatabaseInstance = MongooseProvider
    .builder()
    .setConnectionString(DATABASE_URL)
    .setMongooseInstance(mongoose);
