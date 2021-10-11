import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum';
import { JoiUtils } from 'core/utils/joi.util';
import Joi from 'joi';
import { AbstractInputValidatorInterceptor } from 'core/infrastructure/interceptor/input-validator.interceptor';

export class CreateTimetableRequestInterceptor extends AbstractInputValidatorInterceptor {
    #getSchemaByType = reqType => {
        const requiredFields = {};

        switch (reqType) {
            case TIMETABLE_REQUEST_TYPE.OUT: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.OUT).required();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.ABSENT).required();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT_ADD: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.ABSENT_ADD).required();
                requiredFields.registerTimeId = JoiUtils.objectId().required();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ADD: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.ADD).required();
                requiredFields.registerTimeId = JoiUtils.objectId().required();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.SOON: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.SOON).required();
                requiredFields.customEndTime = JoiUtils.requiredString();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.LATE: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.LATE).required();
                requiredFields.customStartTime = JoiUtils.requiredString();
                break;
            }
        }
        return requiredFields;
    }

    getSchema(req) {
        return Joi.object().keys({
            userId: JoiUtils.objectId().required(),
            type: Joi.string().valid(...Object.values(TIMETABLE_REQUEST_TYPE)).required(),
            description: JoiUtils.requiredString(),
            attachment: JoiUtils.optionalString(),
            tempTimetables: Joi.array().items(Joi.object().keys({
                userId: JoiUtils.objectId().required(),
                groupId: JoiUtils.objectId().optional(),
                appliedDate: JoiUtils.date().required(),
                timetableId: JoiUtils.objectId().required(),
                ...this.#getSchemaByType(req.body.type)
            }))
                .unique(req.body.type === TIMETABLE_REQUEST_TYPE.OUT ? '' : 'timetableId')
                .required(),
        });
    }

    getValueToValidate(req) {
        return req.body;
    }
}
