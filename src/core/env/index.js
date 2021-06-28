import env from 'dotenv';

env.config();
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 4000;
export const HOST = process.env.HOST || 'http://localhost:3000';
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
export const JWT_SECRET = process.env.JWT_SECRET || 'Phudeptrai';
export const EXPIRE_DAYS = process.env.EXPIRE_DAYS || '1d';
export const { DATABASE_URL } = process.env;
export const CORS_ALLOW = process.env.CORS_ALLOW ? process.env.CORS_ALLOW : '*';
export const ROOT_DIR = process.env === 'production' ? `${process.cwd()}/dist` : `${process.cwd()}/src`;
export const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
