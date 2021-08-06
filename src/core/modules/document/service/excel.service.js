import xlsx from 'xlsx';
import { InternalServerException } from 'packages/httpException';
import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { unlink } from 'fs';
import { UserRepository } from '../../user/user.repository';
import { BadRequestException } from '../../../../packages/httpException/BadRequestException';
import { toTimestamp } from '../../../utils/time-convertor.util';
import { InValidHttpResponse } from '../../../../packages/handler/response/invalidHttp.response';

class Service {
    constructor() {
        this.userRepository = UserRepository;
        this.logger = LoggerFactory.create('ExcelService');
    }

    async uploadOne(fileInfor) {
        const filePath = fileInfor.path;
        const workBook = xlsx.readFile(filePath);
        if (workBook.SheetNames.length <= 0) {
            throw new BadRequestException('File has no sheets');
        }

        const firstSheet = workBook.Sheets[workBook.SheetNames[0]];
        const rawData = xlsx.utils.sheet_to_json(firstSheet, { raw: true, defval: null });

        const parsedUser = [];
        const emailList = [];
        const errorDetail = {};

        // convert to Database name
        if (rawData.length > 1) {
            rawData.forEach(user => {
                // validate dateTime type
                const birthday = toTimestamp(user['Ngày sinh']);
                if (Number.isNaN(birthday) || null) {
                    if (!errorDetail['datetime']) {
                        errorDetail['datetime'] = [];
                    }
                    errorDetail['datetime'].push(user['Email']);
                }

                emailList.push(user['Email']);
                parsedUser.push({
                    email: user['Email'],
                    profile: {
                        firstName: user['Tên'],
                        lastName: user['Họ và tên đệm'],
                        birthday: birthday || null,
                        phone: user['SĐT']
                    }
                });
            });
        }

        // check email duplicated
        let existedEmails;
        try {
            const chunkSize = 100;
            existedEmails = await this.userRepository.getAvailableByEmails(emailList);
            existedEmails = existedEmails.map(element => element.email);
            let payload = [];
            for (let i = 0; i < parsedUser.length; i += 1) {
                if (!existedEmails.includes(parsedUser[i].email) && !errorDetail['datetime']?.includes(parsedUser[i].email)) {
                    payload.push(parsedUser[i]);
                }

                if ((i % chunkSize === 0 && i !== 0) || (i === parsedUser.length - 1)) {
                    // eslint-disable-next-line no-await-in-loop
                    await this.userRepository.model.insertMany(payload);
                    payload = [];
                }
            }
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerException(error.message);
        } finally {
            unlink(filePath, err => {
                if (err) {
                    this.logger.error(err.message);
                    throw new InternalServerException(err.message);
                }
            });
        }

        if (existedEmails.length > 0) {
            errorDetail['email'] = existedEmails;
        }

        if (errorDetail.email || errorDetail.datetime) {
            return InValidHttpResponse.toBadRequestResponse('These users have invalid birthday or unavailable email', errorDetail);
        }
    }
}

export const ExcelService = new Service();
