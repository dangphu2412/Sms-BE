import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum';
import { JoiUtils } from 'core/utils/joi.util';
import Joi from 'joi';

export class CreateTimetableRequestSchema {
    #type

    constructor(type) {
        this.#type = type;
    }

    #getRequiredInterceptFieldsByType = type => {
        const requiredFields = {};

        switch (type) {
            case TIMETABLE_REQUEST_TYPE.OUT: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.OUT).required();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.ABSENT).required();
                requiredFields.timetableId = JoiUtils.objectId().required();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT_ADD: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.ABSENT_ADD).required();
                requiredFields.timetableId = JoiUtils.objectId().required();
                requiredFields.registerTime = JoiUtils.objectId().required();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ADD: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.ADD).required();
                requiredFields.timetableId = JoiUtils.objectId().required();
                requiredFields.registerTime = JoiUtils.objectId().required();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.SOON: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.SOON).required();
                requiredFields.timetableId = JoiUtils.objectId().required();
                requiredFields.customEndTime = JoiUtils.requiredString();
                break;
            }
            case TIMETABLE_REQUEST_TYPE.LATE: {
                requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.LATE).required();
                requiredFields.timetableId = JoiUtils.objectId().required();
                requiredFields.customStartTime = JoiUtils.requiredString();
                break;
            }
        }
        return requiredFields;
    };

    getSchema = () => Joi.object().keys({
        userId: JoiUtils.objectId().required(),
        type: this.#getRequiredInterceptFieldsByType(this.#type).type,
        description: Joi.string().required(),
        attachment: JoiUtils.optionalString().optional(),
        tempTimetables: Joi.array().items(Joi.object().keys({
            userId: JoiUtils.objectId().required(),
            groupId: JoiUtils.objectId().optional(),
            appliedDate: JoiUtils.date().required(),
            ...this.#getRequiredInterceptFieldsByType(this.#type)
        }))
            .unique(this.#type === TIMETABLE_REQUEST_TYPE.OUT ? '' : 'timetableId')
            .required(),
    })
}
