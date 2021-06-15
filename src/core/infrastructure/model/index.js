import { Schema } from 'mongoose';
import { BaseModel } from './base.model';

function extendSchema(schema, definition, options) {
    return new Schema(
        {
            ...schema.obj,
            ...definition,
        },
        options
    );
}

export function extendBaseModel(definition, options) {
    return extendSchema(BaseModel, definition, {
        timestamps: true,
        ...options
    });
}
