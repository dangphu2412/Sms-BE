import { InternalServerException } from 'packages/httpException';
import { deleteFile } from '../../../utils/systemFile';
import { cloudinaryUploader } from '../../../config/cloudinary';

class Service {
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
            deleteFile(file.path);
        }
    }

    async uploadMany(files, folderUrl = '') {
        const uploadTasks = files.map(file => this.uploadOne(file, folderUrl));

        try {
            return Promise.all(uploadTasks);
        } catch (error) {
            throw new InternalServerException(error.message);
        }
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
