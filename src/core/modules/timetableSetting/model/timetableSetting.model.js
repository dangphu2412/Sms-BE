import { model } from 'mongoose';
import { extendBaseModel } from 'core/infrastructure/model';

const schema = extendBaseModel({
  alias: { type: String, required: [true, 'alias is empty'] },
  startTime: { type: String, required: [true, 'startTime is empty'] },
  endTime: { type: String, required: [true, 'endTime is empty'] },
  status: { type: Boolean, default: true },
});

export const TimetableSettingModel = model(
  'timetable_settings',
  schema,
);
