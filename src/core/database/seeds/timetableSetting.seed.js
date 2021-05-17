import { parallel } from 'packages/taskExecution';
import { timetableDump } from '../data/init';

export default class UserSeeder {
	constructor(db) {
		this.db = db;
	}

	async run() {
		const collection = this.db.collection('timetable_settings');

		await parallel(
			timetableDump,
			item => collection.findOneAndUpdate(
				{ _id: item._id }, { $set: item }, { new: true, upsert: true }
			)
		);
	}
}
