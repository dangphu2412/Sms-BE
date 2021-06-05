import mongoose from 'mongoose';
import path from 'path';

export function getSeedPathWithExtensions() {
    const EXTENSIONS = ['.js'];
    const SEED_PATH = 'seeds';
    const seedPath = path.join(__dirname, '..', 'database', SEED_PATH);
    return { seedPath, EXTENSIONS };
}

export function generateObjectId() {
    return mongoose.Types.ObjectId();
}

export function parseObjectId(str) {
    return mongoose.Types.ObjectId(str);
}

export function toJSON(mongoCollection) {
    return JSON.parse(JSON.stringify(mongoCollection));
}
