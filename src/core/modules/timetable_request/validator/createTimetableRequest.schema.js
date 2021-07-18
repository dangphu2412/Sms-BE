import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum';
import { SchemaValidatorBuilder } from 'core/utils/schema.builder';
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
            requiredFields.timetableId = SchemaValidatorBuilder.getIdObjectBuilder().required();
            break;
        }
        case TIMETABLE_REQUEST_TYPE.ABSENT_ADD: {
            requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.ABSENT_ADD).required();
            requiredFields.timetableId = SchemaValidatorBuilder.getIdObjectBuilder().required();
            requiredFields.registerTime = SchemaValidatorBuilder.getIdObjectBuilder().required();
            break;
        }
        case TIMETABLE_REQUEST_TYPE.ADD: {
            requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.ADD).required();
            requiredFields.timetableId = SchemaValidatorBuilder.getIdObjectBuilder().required();
            requiredFields.registerTime = SchemaValidatorBuilder.getIdObjectBuilder().required();
            break;
        }
        case TIMETABLE_REQUEST_TYPE.SOON: {
            requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.SOON).required();
            requiredFields.timetableId = SchemaValidatorBuilder.getIdObjectBuilder().required();
            requiredFields.customEndTime = SchemaValidatorBuilder.getRequiredStringBuilder();
            break;
        }
        case TIMETABLE_REQUEST_TYPE.LATE: {
            requiredFields.type = Joi.string().valid(TIMETABLE_REQUEST_TYPE.LATE).required();
            requiredFields.timetableId = SchemaValidatorBuilder.getIdObjectBuilder().required();
            requiredFields.customStartTime = SchemaValidatorBuilder.getRequiredStringBuilder();
            break;
        }
        }
        return requiredFields;
    };

    getSchema = () => Joi.object().keys({
        userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
        type: this.#getRequiredInterceptFieldsByType(this.#type).type,
        description: Joi.string().required(),
        attachment: SchemaValidatorBuilder.getOptionalStringBuilder().optional(),
        tempTimetables: Joi.array().items(Joi.object().keys({
            userId: SchemaValidatorBuilder.getIdObjectBuilder().required(),
            groupId: SchemaValidatorBuilder.getIdObjectBuilder().optional(),
            appliedDate: SchemaValidatorBuilder.getDateBuilder().required(),
            ...this.#getRequiredInterceptFieldsByType(this.#type)
        }))
            .unique(this.#type === TIMETABLE_REQUEST_TYPE.OUT ? '' : 'timetableId')
            .required(),
        isApproved: Joi.boolean().valid(false).optional(),
    })
}
