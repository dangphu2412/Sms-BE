import Joi from 'joi';
import { TIMETABLE_TYPE } from 'core/common/enum';
import { BaseValidateInterceptor } from 'core/infrastructure/interceptor';
import { SchemaValidation } from 'core/utils';
import { cloneDeep, keyBy } from 'lodash';
import { UnprocessableEntityExeception } from 'packages/httpException';
import { InValidHttpResponse } from 'packages/handler/response/invalidHttp.response';
import { HttpException } from 'packages/httpException/HttpException';
import { BAD_REQUEST } from 'http-status';
import { ERROR_CODE } from 'packages/httpException/error.enum';
import { TimetableSettingRepository } from 'core/modules/timetableSetting/repository';
import { ActivityRepository } from 'core/modules/activity/repository';

export class CreateTimetableInterceptor extends BaseValidateInterceptor {
  constructor() {
    super();
    this.timetableSettingRepository = TimetableSettingRepository;
    this.activityRepository = ActivityRepository;
  }

  getSchema = () => Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.number().min(0).max(7),
        userId: SchemaValidation.objectId().required(),
        type: Joi.string()
          .valid(TIMETABLE_TYPE.PERMANENT, TIMETABLE_TYPE.TEMP)
          .required(),
        registerTimeId: SchemaValidation.objectId().required(),
        activityId: SchemaValidation.objectId().required(),
        startDate: SchemaValidation.strDate().required(),
        endDate: SchemaValidation.strDate().required(),
        isActive: Joi.boolean().required(),
        isApproved: Joi.boolean().optional().default(false),
      })
    );

  intercept = async (req, res, next) => {
    try {
      this.schema = this.getSchema();
      this.dataToValidate = this.getData(req);
      await this.validation();
      await this.validateActitvities(req.body);
      const payload = await this.transformRegisterTime(req);
      req.body = payload;
      return next();
    } catch (err) {
      if (err instanceof HttpException) {
        return new InValidHttpResponse(err.status, err.code, err.message)
                    .toResponse(res);
      }
      return new InValidHttpResponse(
        BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
        'Bad request',
        err.details?.map(detail => ({
          type: detail.type,
          message: detail.message,
        }))
      ).toResponse(res);
    }
  };

  transformRegisterTime = async req => {
    const payload = cloneDeep(req.body);
    const settingIds = payload.map(item => item.registerTimeId);
    let timeTableSettings = await this.timetableSettingRepository.find({
      _id: {
        $in: settingIds
      },
      isActive: true
    });
    timeTableSettings = keyBy(timeTableSettings, '_id');
    payload.forEach(item => {
      item.registerTime = timeTableSettings[item.registerTimeId];
      delete item.registerTimeId;
      if (!item.registerTime) {
        throw new UnprocessableEntityExeception('registerTime in payload is unexisted or deleted');
      }
    });
    return payload;
  }

  validateActitvities = async body => {
    let activityIdSet = body.map(item => item.activityId);
    activityIdSet = [...new Set(activityIdSet)];
    const availableActivities = await this.activityRepository.find({
      _id: {
        $in: activityIdSet
      },
      isActive: true
    });
    if (activityIdSet.length !== availableActivities.length) {
      throw new UnprocessableEntityExeception('activities in payload is unexisted or deleted');
    }
    return true;
  }
}
