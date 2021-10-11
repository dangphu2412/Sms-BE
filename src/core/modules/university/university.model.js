import { model } from 'mongoose';

const schema = {
    fullName: {
        type: String,
        trim: true,
        required: [true, 'Full name of university is empty'],
    },
    shortName: {
        type: String,
        trim: true,
        required: [true, 'Short name of university is empty'],
    },
};
export const UniversityModel = model('universities', schema);
