import xlsx from 'xlsx';
import { InternalServerException } from 'packages/httpException';
import { logger } from '../../logger/winston';
import { UserRepository } from '../../user/repository/user.repository';
import { BadRequestException } from '../../../../packages/httpException/BadRequestException';
import { deleteFile } from '../../../utils/systemFile';
import { toTimestamp } from '../../../utils/timeConvert';
import { InValidHttpResponse } from '../../../../packages/handler/response/invalidHttp.response';

class Service {
  constructor() {
    this.userRepository = UserRepository;
    this.logger = logger;
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
            birthday: toTimestamp(user['Ngày sinh']) || null,
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
        if (!existedEmails.includes(parsedUser[i].email)) {
          payload.push(parsedUser[i]);
        }
        if ((i % chunkSize === 0 && i !== 0) || (i === parsedUser.length - 1)) {
          // eslint-disable-next-line no-await-in-loop
          await this.userRepository.createMany(payload);
          payload = [];
        }
      }
    } catch (error) {
      logger.error(error.message);
      throw new InternalServerException(error.message);
    } finally {
      deleteFile(filePath);
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
