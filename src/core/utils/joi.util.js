import { SocialKind } from 'core/common/enum/social.enum';
import Joi from 'joi';

const MONGOOSE_ID_OBJECT_FORMAT = /^[0-9a-fA-F]{24}$/;

const PHONE_NUMBER_FORMAT = /^[0-9+ ]{10,11}$/;

const DATE_YYYY_MM_DD_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

const FACEBOOK_PROFILE_URI_FORMAT = /(https?:\/\/www.facebook|fb|m\.facebook)\.(?:com|me)\/(\w+)?\/?/i;

// Required from 6-30 char, contains special char
const PWD_FORMAT = /^[a-zA-Z0-9\d@$!%*?&]{6,30}$/;

export class JoiUtils {
    static objectId() {
        return Joi.string().regex(MONGOOSE_ID_OBJECT_FORMAT);
    }

    static optionalString() {
        return Joi
            .string()
            .optional();
    }

    static requiredString() {
        return Joi
            .string()
            .trim()
            .required();
    }

    static phoneNumber() {
        return Joi.string().regex(PHONE_NUMBER_FORMAT);
    }

    static email = () => Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } });

    static date() {
        return Joi.string().regex(DATE_YYYY_MM_DD_FORMAT);
    }

    static social(kind) {
        let builder;
        switch (kind) {
            case SocialKind.FACEBOOK:
                builder = Joi.string().regex(FACEBOOK_PROFILE_URI_FORMAT);
                break;
            case SocialKind.GOOGLE:
            case SocialKind.TWITTER:
            default:
                throw new Error('Unsupported kind of social to validate');
        }
        return builder;
    }

    static password() {
        return Joi.string().regex(PWD_FORMAT);
    }

    static optionalStrings() {
        return Joi.array().items(JoiUtils.optionalString()).min(1);
    }
}
