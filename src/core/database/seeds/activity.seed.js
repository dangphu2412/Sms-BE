import { parallel } from 'packages/taskExecution';
import { activityDump } from '../data/init';

export default class UserSeeder {
	constructor(db) {
		this.db = db;
	}

	async run() {
		const collection = this.db.collection('activities');

		await parallel(
			activityDump,
			item => collection.findOneAndUpdate(
				{ _id: item._id }, { $set: item }, { new: true, upsert: true }
			)
		);
	}
}
