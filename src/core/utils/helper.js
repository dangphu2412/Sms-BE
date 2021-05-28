import path from 'path';

export function getSeedPathWithExtensions() {
    const EXTENSIONS = ['.js'];
    const SEED_PATH = 'seeds';
    const seedPath = path.join(__dirname, '..', 'database', SEED_PATH);
    return { seedPath, EXTENSIONS };
}
