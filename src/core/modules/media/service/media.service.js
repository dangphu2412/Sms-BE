import { BadRequestException } from 'packages/httpException';
import { logger } from '../../logger/winston';
import { UserRepository } from '../../user/repository/user.repository';
import { deleteFile } from '../../../utils/systemFile';
import { cloudinaryHandler } from '../../../config/cloudinary';

class Service {
    constructor() {
        this.userRepository = UserRepository;
        this.logger = logger;
    }

    async uploadMany(filesInfor, folderUrl) {
        const promises = [];
        filesInfor.forEach(file => {
            const imageFile = file.path;
            promises.push(cloudinaryHandler.uploadOne(imageFile, folderUrl));
            deleteFile(imageFile);
        });

        try {
            return await Promise.all(promises);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteMany(fileIds) {
        const promises = [];
        fileIds.forEach(file => {
            promises.push(cloudinaryHandler.deleteOne(file));
        });

        try {
            return Promise.all(promises);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}

export const MediaService = new Service();
