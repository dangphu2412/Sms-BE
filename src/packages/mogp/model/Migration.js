import { Schema, model } from 'mongoose';

const migrationSchema = new Schema({
    history: [String]
});

export const MigrationModel = model('migrations', migrationSchema);
