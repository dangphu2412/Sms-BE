import multer from 'multer';
import path from 'path';
import { InternalServerException } from '../../packages/httpException';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(`${process.cwd()}/src/core/uploads`));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedExt = ['.xlsx'];
        if (!allowedExt.includes(path.extname(file.originalname))) return cb(new InternalServerException(400, 'File type not allowed'));
        return cb(null, true);
    },
});

/**
 *
 * @param {*} keyName : Request key name
 * @param {*} isMany : Is it a many upload request ?
 * @param {*} numberOfFile : Maximum file
 * @returns
 */
export const uploadMulter = (keyName, isMany, numberOfFile) => {
    let uploadHandler;
    if (isMany) {
      uploadHandler = upload.array(keyName, numberOfFile);
    } else {
      uploadHandler = upload.single(keyName);
    }
    return uploadHandler;
  };
