import { v2 as cloudinary } from 'cloudinary';
import { logger } from 'core/utils';
import { BadRequestException } from 'packages/httpException';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../env';

class CloudinaryHandler {
    constructor() {
        logger.info(`[${CloudinaryHandler.name}] is building`);
        this.init();
    }

    init() {
        cloudinary.config({
            cloud_name: CLOUDINARY_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
            secure: true
        });
    }

    async uploadOne(imageFile, folderUrl = '') {
        try {
            const result = await cloudinary.uploader.upload(imageFile, { public_id: folderUrl });
            return result.secure_url;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteOne(imageFile) {
        try {
            const result = await cloudinary.uploader.destroy(imageFile);
            return result;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}

export const cloudinaryHandler = new CloudinaryHandler();
