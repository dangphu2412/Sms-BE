import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { unlink } from 'fs';
import { InternalServerException } from 'packages/httpException';
import { cloudinaryUploader } from '../../../config/cloudinary.config';

class Service {
    constructor() {
        this.logger = LoggerFactory.create('MediaService');
    }

    async uploadOne(file, folderUrl = '') {
        try {
            const response = await cloudinaryUploader.upload(file.path, { folder: folderUrl });
            return {
                originalName: response.original_filename,
                url: response.secure_url,
                width: response.width,
                height: response.height
            };
        } catch (error) {
            throw new InternalServerException(error.message);
        } finally {
            unlink(file.path, err => {
                if (err) {
                    this.logger.error(err.message);
                    throw new InternalServerException(err.message);
                }
            });
        }
    }

    async uploadMany(files, folderUrl = '') {
        const uploadTasks = files.map(file => this.uploadOne(file, folderUrl));

        return Promise.all(uploadTasks);
    }

    async deleteMany(ids) {
        const deleteTasks = ids.map(id => this.deleteOne(id));

        return Promise.all(deleteTasks);
    }

    async deleteOne(id) {
        const response = await cloudinaryUploader.destroy(id);
        return {
            id,
            result: response.result
        };
    }
}

export const MediaService = new Service();
