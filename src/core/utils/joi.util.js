import { SocialKind } from 'core/common/enum/social.enum';
import Joi from 'joi';

export class JoiUtils {
    static VALIDATE_ID_OBJECT_PATTERN = /^[0-9a-fA-F]{24}$/;

    static VALIDATE_PHONE_NUMBER_PATTERN = /^[0-9+ ]{10,11}$/;

    static VALIDATE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

    static VALIDATE_FACEBOOK_PATTERN = /(https?:\/\/www.facebook|fb|m\.facebook)\.(?:com|me)\/(\w+)?\/?/i;

    static VALIDATE_PWD_PATTERN_V1 = /^[a-zA-Z0-9\d@$!%*?&]{6,30}$/

    static VALIDATE_PWD_PATTERN_V2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    static objectId(custom = false) {
        return custom
            ? Joi.string().regex(JoiUtils.VALIDATE_ID_OBJECT_PATTERN)
            : Joi.string().regex(JoiUtils.VALIDATE_ID_OBJECT_PATTERN)
                .message('Invalid IdObject format');
    }

    static optionalString() {
        return Joi
            .string()
            .optional();
    }

    static requiredString() {
        return Joi
            .string()
            .required();
    }

    static phoneNumber(custom = false) {
        return custom
            ? Joi.string().regex(JoiUtils.VALIDATE_PHONE_NUMBER_PATTERN)
            : Joi.string().regex(JoiUtils.VALIDATE_PHONE_NUMBER_PATTERN)
                .message('Invalid phone number format');
    }

    static email = () => Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } });

    static date(custom = false) {
        return custom
            ? Joi.string().regex(JoiUtils.VALIDATE_DATE_PATTERN)
            : Joi.string().regex(JoiUtils.VALIDATE_DATE_PATTERN)
                .message('Invalid date format. Should be YYYY-MM-DD');
    }

    static social(kind, custom = false) {
        let builder;
        switch (kind) {
            case SocialKind.FACEBOOK:
                builder = custom
                    ? Joi.string().regex(JoiUtils.VALIDATE_FACEBOOK_PATTERN)
                    : Joi.string().regex(JoiUtils.VALIDATE_FACEBOOK_PATTERN)
                        .message('Invalid facebook format');
                break;
            case SocialKind.GOOGLE:
            case SocialKind.TWITTER:
            default:
                throw new Error('Unsupported kind of social to validate');
        }
        return builder;
    }

    static password(custom = false) {
        return custom
            ? Joi.string().regex(JoiUtils.VALIDATE_PWD_PATTERN_V1)
            : Joi.string().regex(JoiUtils.VALIDATE_PWD_PATTERN_V1)
                .message('Invalid password format. Minimum 6 characters');
    }

    static optionalStrings() {
        return Joi.array().items(JoiUtils.optionalString()).min(1);
    }
}
